import { Injectable } from '@nestjs/common';
import { Users, UsersRelations } from '@prisma/client';
import * as fs from 'fs';
import { InjectS3, S3 } from 'nestjs-s3';
import { InternalHttpResponse } from 'src/core/http/internalHttpResponse';
import { InternalHttpStatus } from 'src/core/http/internalHttpStatus';

import { InternalHttpException, InternalHttpExceptionErrorCode } from '../../core/http/internalHttpException';
import { IJWTServiceVerifyPayloadResult } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { reverseRelationTypeMapping } from '../relation/constants';
import { RelationService } from '../relation/relation.service';
import { IGetUserRelation, IUserWithRelations, RelationList, RelationRequestType } from '../relation/types';
import { S3Service } from '../s3/s3.service';
import { GetRelationsByTypeDto } from './dto/get-relations-by-type.dto';
import { SearchByUsernameDto } from './dto/search-by-username.dto';
import { SendRelationRequestDto } from './dto/send-relation-request.dto';
import { SetProfileInfoDto } from './dto/set-profile-info.dto';
import { SetProfileInfoFieldName } from './user.types';

@Injectable()
export class UserService {
    constructor(
        private readonly s3: S3Service,
        private readonly prismaService: PrismaService,
        private readonly relationService: RelationService,
    ) {}

    async _createUserByPhoneIfNotExist(phone: string) {
        let user = await this.prismaService.users.findFirst({ where: { phone } });

        if (!user) {
            user = await this.prismaService.users.create({ data: { phone } });
        }

        return user;
    }

    async getUserByPhone(phone: string) {
        return await this.prismaService.users.findFirst({
            where: {
                phone,
            },
        });
    }

    async setProfileInfo(dto: SetProfileInfoDto, user: IJWTServiceVerifyPayloadResult): Promise<InternalHttpResponse> {
        if (dto.fieldName === SetProfileInfoFieldName.UserName) {
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            const record = await this.prismaService.users.findUnique({ where: { userName: dto.fieldValue as string } });

            if (record && record.uuid !== user.uuid) {
                throw new InternalHttpException({
                    status: InternalHttpStatus.BAD_REQUEST,
                    errorCode: InternalHttpExceptionErrorCode.NonUnique,
                    message: 'Значение поля должно быть уникальным',
                });
            }
        }

        await this.prismaService.users.update({
            where: { uuid: user.uuid },
            data: { [dto.fieldName]: dto.fieldValue },
        });

        return new InternalHttpResponse();
    }

    async getUser({ uuid }: IJWTServiceVerifyPayloadResult): Promise<InternalHttpResponse<IUserWithRelations>> {
        const user = await this.prismaService.users.findUnique({
            where: { uuid: uuid },
            include: { userRelations: true },
        });

        return new InternalHttpResponse({ data: user });
    }

    async getRelationsByType(
        uuid: string,
        { type }: GetRelationsByTypeDto,
    ): Promise<InternalHttpResponse<IGetUserRelation[]>> {
        const relations = await this.relationService.getRelationsByType(uuid, type);

        return new InternalHttpResponse({ data: relations });
    }

    async searchByUsername(
        { username }: SearchByUsernameDto,
        { uuid }: IJWTServiceVerifyPayloadResult,
    ): Promise<InternalHttpResponse<IGetUserRelation[]>> {
        const user = await this.prismaService.users.findFirst({
            where: {
                userName: username.toLocaleUpperCase(),
                NOT: [{ displayName: null }, { birthday: null }],
            },
            include: { userRelations: true },
        });

        if (!user) {
            return new InternalHttpResponse<IGetUserRelation[]>({ data: [] });
        }

        const relationWithUser = user.userRelations.find(relation => relation.targetUserUuid === uuid);

        let type = RelationList.Nobody;

        if (relationWithUser) {
            type = reverseRelationTypeMapping[relationWithUser.type];
        }

        if (user.uuid === uuid) {
            type = RelationList.You;
        }

        return new InternalHttpResponse<IGetUserRelation[]>({
            data: [
                {
                    type,
                    user,
                },
            ],
        });
    }

    async sendRelationRequest(
        { to, relationType }: SendRelationRequestDto,
        { uuid }: IJWTServiceVerifyPayloadResult,
    ): Promise<InternalHttpResponse | InternalHttpResponse<IGetUserRelation> | InternalHttpException> {
        switch (relationType) {
            case RelationRequestType.SendRequestToFriends: {
                return await this.relationService.sendRequestToFriends(uuid, to);
            }

            case RelationRequestType.ResolveFriendRequest: {
                return await this.relationService.resolveFriendRequest(uuid, to);
            }

            case RelationRequestType.CancelFriendRequest: {
                return await this.relationService.cancelFriendRequest(uuid, to);
            }

            case RelationRequestType.RejectFriendRequest: {
                return await this.relationService.rejectFriendRequest(uuid, to);
            }

            case RelationRequestType.RemoveFromFriends: {
                return await this.relationService.removeFromFriends(uuid, to);
            }

            default: {
                throw new InternalHttpException({
                    status: InternalHttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Что-то пошло не так',
                });
            }
        }
    }

    async uploadAvatar(
        { uuid }: IJWTServiceVerifyPayloadResult,
        file: Express.Multer.File,
    ): Promise<InternalHttpResponse<string>> {
        const user = await this.prismaService.users.findUnique({ where: { uuid } });

        if (user.avatarUrl) {
            await this.deleteAvatar(user);
        }

        const avatarUrl = await this.s3.uploadAvatar(file.buffer);

        await this.prismaService.users.update({ where: { uuid }, data: { avatarUrl } });

        return new InternalHttpResponse<string>({
            data: avatarUrl,
        });
    }

    async deleteAvatar({ uuid }: IJWTServiceVerifyPayloadResult): Promise<InternalHttpResponse> {
        const user = await this.prismaService.users.findUnique({ where: { uuid } });

        if (user.avatarUrl) {
            await this.s3.deleteAvatar(user.avatarUrl);

            await this.prismaService.users.update({ where: { uuid }, data: { avatarUrl: null } });

            return new InternalHttpResponse();
        }

        throw new InternalHttpException({
            status: InternalHttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Что-то пошло не так',
        });
    }
}
