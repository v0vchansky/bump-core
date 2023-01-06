import { Injectable } from '@nestjs/common';
import { Geolocations } from '@prisma/client';
import { InternalHttpException, InternalHttpExceptionErrorCode } from 'src/core/http/internalHttpException';
import { InternalHttpResponse } from 'src/core/http/internalHttpResponse';
import { InternalHttpStatus } from 'src/core/http/internalHttpStatus';

import { IJWTServiceVerifyPayloadResult } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { RelationList } from '../relation/types';
import { ShadowActionsService } from '../shadow-actions/shadow-actions.service';
import { ShadowAction } from '../shadow-actions/types';
import { GetLastUserLocationDto } from './dto/get-last-user-location';
import { RequestUpdateUsersLocationsDto } from './dto/request-update-users-locations.dto';
import { SetGeolocationDto } from './dto/set-geolocation.dto';

@Injectable()
export class GeolocationService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly shadowActionsService: ShadowActionsService,
    ) {}

    async setGeolocation(dto: SetGeolocationDto, user: IJWTServiceVerifyPayloadResult) {
        try {
            await this.prismaService.geolocations.createMany({
                data: dto.points.map(data => ({ ...data, localTime: new Date(data.localTime), userUuid: user.uuid })),
            });

            return new InternalHttpResponse({ data: undefined });
        } catch (_e) {
            throw new InternalHttpException({
                status: InternalHttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Не удалось добавить точки геолокаций',
            });
        }
    }

    async getLastUserLocation(
        dto: GetLastUserLocationDto,
        user: IJWTServiceVerifyPayloadResult,
    ): Promise<InternalHttpResponse<Geolocations> | InternalHttpException> {
        const targetUser = await this.prismaService.users.findUnique({
            where: { uuid: dto.userUuid },
            include: { userRelations: true, geolocations: { orderBy: { createdAt: 'desc' }, take: 1 } },
        });

        const isFriends = Boolean(
            targetUser.userRelations.find(
                relation => relation.type === RelationList.Friendship && relation.targetUserUuid === user.uuid,
            ),
        );

        if (!isFriends) {
            throw new InternalHttpException({
                status: InternalHttpStatus.FORBIDDEN,
                message: 'Геоолокацию пользователя могут видеть только друзья',
                errorCode: InternalHttpExceptionErrorCode.UserIsNotFriend,
            });
        }

        if (targetUser.geolocations.length > 0) {
            return new InternalHttpResponse({ data: targetUser.geolocations[0] });
        }

        throw new InternalHttpException({
            status: InternalHttpStatus.NOT_FOUND,
            message: 'Пользователь еще не отправлял свои геокоординаты',
            errorCode: InternalHttpExceptionErrorCode.UserNotHaveCoordinates,
        });
    }

    async requestUpdateUsersLocations(
        dto: RequestUpdateUsersLocationsDto,
        user: IJWTServiceVerifyPayloadResult,
    ): Promise<InternalHttpResponse | InternalHttpException> {
        const me = await this.prismaService.users.findUnique({
            where: { uuid: user.uuid },
            include: { userRelations: true },
        });

        if (me) {
            const friendsUuids = me.userRelations
                .filter(relation => relation.type === RelationList.Friendship)
                .map(relation => relation.targetUserUuid);

            dto.userUuids.forEach(async targetUserUuid => {
                if (friendsUuids.includes(targetUserUuid)) {
                    await this.shadowActionsService.sendShadowAction(
                        targetUserUuid,
                        ShadowAction.ForceSendGeolocaton,
                        {
                            type: ShadowAction.ForceGetLastUserLocation,
                            targetUserUuid: user.uuid,
                            payload: { userUuid: targetUserUuid },
                            onCompleteAction: undefined,
                        },
                        undefined,
                    );
                }
            });

            return new InternalHttpResponse();
        }

        throw new InternalHttpException({
            status: InternalHttpStatus.NOT_FOUND,
            message: 'Пользователь не найден',
        });
    }
}
