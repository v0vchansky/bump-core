import { Injectable, UseInterceptors } from '@nestjs/common';
import { InternalHttpException, InternalHttpExceptionErrorCode } from 'src/core/http/internalHttpException';
import { InternalHttpResponse } from 'src/core/http/internalHttpResponse';
import { InternalHttpStatus } from 'src/core/http/internalHttpStatus';

import { SentryInterceptor } from '../sentry/sentry.interceptor';
import { RelationRepository } from './relation.repository';
import { IGetUserRelation, RelationList } from './types';

@UseInterceptors(SentryInterceptor)
@Injectable()
export class RelationService {
    constructor(private readonly relationRepository: RelationRepository) {}

    async sendRequestToFriends(
        from: string,
        to: string,
    ): Promise<InternalHttpResponse<IGetUserRelation> | InternalHttpException> {
        const allRelations = await this.relationRepository.getAllRelationsBetweenUsers(from, to);

        if (allRelations.length > 0) {
            throw new InternalHttpException({
                status: InternalHttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Это действие недоступно',
                errorCode: InternalHttpExceptionErrorCode.NeedForceUpdateRelations,
            });
        }

        await this.relationRepository.removeAllRelationsBetweenUsers(from, to);

        await this.relationRepository.createTwoSideRelation(
            from,
            to,
            RelationList.OutgoingFriendRequest,
            RelationList.IncomingFriendRequest,
        );

        const relation = await this.relationRepository.getUserRelationByType(
            from,
            to,
            RelationList.OutgoingFriendRequest,
        );

        return new InternalHttpResponse({ data: relation });
    }

    async resolveFriendRequest(
        from: string,
        to: string,
    ): Promise<InternalHttpResponse<IGetUserRelation> | InternalHttpException> {
        const payload = await this.relationRepository.removeRelationByType(
            from,
            to,
            RelationList.IncomingFriendRequest,
            RelationList.OutgoingFriendRequest,
        );

        if (payload.count !== 2) {
            throw new InternalHttpException({
                status: InternalHttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Это действие недоступно',
                errorCode: InternalHttpExceptionErrorCode.NeedForceUpdateRelations,
            });
        }

        await this.relationRepository.createTwoSideRelation(from, to, RelationList.Friendship, RelationList.Friendship);

        const friendship = await this.relationRepository.getUserRelationByType(from, to, RelationList.Friendship);

        return new InternalHttpResponse({ data: friendship });
    }

    async cancelFriendRequest(from: string, to: string): Promise<InternalHttpResponse | InternalHttpException> {
        const payload = await this.relationRepository.removeRelationByType(
            from,
            to,
            RelationList.OutgoingFriendRequest,
            RelationList.IncomingFriendRequest,
        );

        if (payload.count !== 2) {
            throw new InternalHttpException({
                status: InternalHttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Это действие недоступно',
                errorCode: InternalHttpExceptionErrorCode.NeedForceUpdateRelations,
            });
        }

        return new InternalHttpResponse();
    }

    async rejectFriendRequest(from: string, to: string): Promise<InternalHttpResponse | InternalHttpException> {
        const payload = await this.relationRepository.removeRelationByType(
            from,
            to,
            RelationList.IncomingFriendRequest,
            RelationList.OutgoingFriendRequest,
        );

        if (payload.count !== 2) {
            throw new InternalHttpException({
                status: InternalHttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Это действие недоступно',
                errorCode: InternalHttpExceptionErrorCode.NeedForceUpdateRelations,
            });
        }

        return new InternalHttpResponse();
    }

    async removeFromFriends(from: string, to: string): Promise<InternalHttpResponse | InternalHttpException> {
        const payload = await this.relationRepository.removeRelationByType(
            from,
            to,
            RelationList.Friendship,
            RelationList.Friendship,
        );

        if (payload.count !== 2) {
            throw new InternalHttpException({
                status: InternalHttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Это действие недоступно',
                errorCode: InternalHttpExceptionErrorCode.NeedForceUpdateRelations,
            });
        }

        return new InternalHttpResponse();
    }

    async getRelationsByType(uuid: string, type: RelationList): Promise<IGetUserRelation[]> {
        switch (type) {
            case RelationList.Friendship:
                return await this.relationRepository.getUserRelationsByType(uuid, RelationList.Friendship);
            case RelationList.IncomingFriendRequest:
                return await this.relationRepository.getUserRelationsByType(uuid, RelationList.IncomingFriendRequest);
            case RelationList.OutgoingFriendRequest:
                return await this.relationRepository.getUserRelationsByType(uuid, RelationList.OutgoingFriendRequest);
        }
    }
}
