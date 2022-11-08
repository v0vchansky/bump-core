import { Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { InternalHttpResponse } from 'src/core/http/internalHttpResponse';
import { InternalHttpStatus } from 'src/core/http/internalHttpStatus';

import { InternalHttpException, InternalHttpExceptionErrorCode } from '../../core/http/internalHttpException';
import { IJWTServiceVerifyPayloadResult } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { SetProfileInfoDto } from './dto/set-profile-info.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

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
        if (dto.unique) {
            const record = await this.prismaService.users.findUnique({ where: { [dto.fieldName]: dto.fieldValue } });

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

    async getUser({ uuid }: IJWTServiceVerifyPayloadResult): Promise<InternalHttpResponse<Users>> {
        const user = await this.prismaService.users.findUnique({ where: { uuid: uuid } });

        return new InternalHttpResponse({ data: user });
    }
}
