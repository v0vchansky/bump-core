import { Injectable } from '@nestjs/common';
import { InternalHttpResponse } from 'src/core/http/internalHttpResponse';

import { PrismaService } from '../prisma/prisma.service';
import { RelationRepository } from './relation.repository';
import { IGetUserRelation, RelationList } from './types';

@Injectable()
export class RelationService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly relationRepository: RelationRepository,
    ) {}

    async sendRequestToFriends(from: string, to: string): Promise<InternalHttpResponse<IGetUserRelation>> {
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

    async resolveFriendRequest(from: string, to: string): Promise<InternalHttpResponse<IGetUserRelation>> {
        await this.relationRepository.removeRelationByType(
            from,
            to,
            RelationList.IncomingFriendRequest,
            RelationList.OutgoingFriendRequest,
        );

        await this.relationRepository.createTwoSideRelation(from, to, RelationList.Friendship, RelationList.Friendship);

        const friendship = await this.relationRepository.getUserRelationByType(from, to, RelationList.Friendship);

        return new InternalHttpResponse({ data: friendship });
    }

    async cancelFriendRequest(from: string, to: string) {
        await this.relationRepository.removeRelationByType(
            from,
            to,
            RelationList.OutgoingFriendRequest,
            RelationList.IncomingFriendRequest,
        );

        return new InternalHttpResponse();
    }

    async rejectFriendRequest(from: string, to: string) {
        await this.relationRepository.removeRelationByType(
            from,
            to,
            RelationList.IncomingFriendRequest,
            RelationList.OutgoingFriendRequest,
        );

        return new InternalHttpResponse();
    }

    async removeFromFriends(from: string, to: string) {
        await this.relationRepository.removeRelationByType(from, to, RelationList.Friendship, RelationList.Friendship);

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
