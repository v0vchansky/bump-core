import { Injectable, UseInterceptors } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { addMinutes, isAfter } from 'date-fns';
import * as admin from 'firebase-admin';
import { InternalHttpResponse } from 'src/core/http/internalHttpResponse';

import { IJWTServiceVerifyPayloadResult } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { SentryInterceptor } from '../sentry/sentry.interceptor';
import { CompleteShadowActionDto } from './dto/complete-shadow-action.dto';
import { OnCompleteAction, ShadowAction, ShadowActionPayload } from './types';

@UseInterceptors(SentryInterceptor)
@Injectable()
export class ShadowActionsService {
    constructor(private readonly prismaService: PrismaService) {}

    private async realbaseDeleteManyActions(items: string[], userUuid: string) {
        const mainRef = admin.database().ref(`shadowActions/${userUuid}`);

        const actions = await (await mainRef.get()).val();

        for (const actionKey in actions) {
            if (items.includes(actions[actionKey])) {
                await mainRef.child(actionKey).remove();
            }
        }
    }

    private async deleteActions(userUuid: string, shouldDeleteActionsUuids: string[]) {
        await this.prismaService.shadowActions.deleteMany({ where: { uuid: { in: shouldDeleteActionsUuids } } });
        await this.realbaseDeleteManyActions(shouldDeleteActionsUuids, userUuid);
    }

    private async clearExpiredActions(userUuid: string) {
        const actions = await this.prismaService.shadowActions.findMany({ where: { targetUserUuid: userUuid } });

        const shouldDeleteActionsUuids = actions
            .filter(action => {
                if (!isAfter(addMinutes(action.createdAt, 3), new Date())) {
                    return true;
                }

                return false;
            })
            .map(action => action.uuid);

        if (shouldDeleteActionsUuids.length > 0) {
            await this.deleteActions(userUuid, shouldDeleteActionsUuids);
        }
    }

    async getShadowAction(actionUuid: string, user: IJWTServiceVerifyPayloadResult) {
        await this.clearExpiredActions(user.uuid);

        const action = await this.prismaService.shadowActions.findFirst({
            where: { uuid: actionUuid, targetUserUuid: user.uuid },
        });

        return new InternalHttpResponse({ data: action });
    }

    async sendShadowAction(
        targetUserUuid: string,
        type: ShadowAction,
        onCompleteAction: OnCompleteAction | null,
        payload: ShadowActionPayload,
    ) {
        await this.clearExpiredActions(targetUserUuid);

        const user = await this.prismaService.users.findUnique({
            where: { uuid: targetUserUuid },
            select: { deviceTokenFCM: true },
        });

        if (user.deviceTokenFCM) {
            const createdAction = await this.prismaService.shadowActions.create({
                data: {
                    targetUserUuid,
                    type,
                    onCompleteAction: onCompleteAction || undefined,
                    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                    payload: (payload as unknown as Prisma.JsonValue) || undefined,
                },
            });

            await admin.messaging().sendToDevice(
                [user.deviceTokenFCM],
                {
                    data: {
                        shadowActionId: createdAction.uuid,
                    },
                    notification: {
                        title: 'Some title',
                        body: 'Some text',
                        sound: 'default',
                    },
                },
                {
                    // Required for background/quit data-only messages on iOS
                    contentAvailable: true,
                    // Required for background/quit data-only messages on Android
                    priority: 'high',
                },
            );

            // const ref = admin.database().ref(`shadowActions/${targetUserUuid}`);

            // await ref.push(createdAction.uuid);
        }
    }

    async completeShadowAction(dto: CompleteShadowActionDto, user: IJWTServiceVerifyPayloadResult) {
        const completedAction = await this.prismaService.shadowActions.findUnique({ where: { uuid: dto.actionUuid } });

        if (completedAction) {
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            const nextAction = completedAction.onCompleteAction as OnCompleteAction | null;

            if (nextAction) {
                await this.sendShadowAction(
                    nextAction.targetUserUuid,
                    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                    nextAction.type as ShadowAction,
                    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                    nextAction.onCompleteAction as OnCompleteAction,
                    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                    nextAction.payload as unknown as ShadowActionPayload,
                );
            }
        }

        await this.deleteActions(user.uuid, [dto.actionUuid]);

        return new InternalHttpResponse();
    }
}
