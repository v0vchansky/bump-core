import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { reverseRelationTypeMapping } from './constants';
import { RelationList } from './types';

@Injectable()
export class RelationRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async getUserRelationsByType(uuid: string, type: RelationList) {
        const relations = await this.prismaService.usersRelations.findMany({
            select: {
                type: true,
                user: {
                    include: {
                        userRelations: {
                            where: {
                                type: RelationList.Friendship,
                            },
                        },
                    },
                },
            },
            where: {
                targetUserUuid: uuid,
                type: reverseRelationTypeMapping[type],
            },
        });

        return relations.map(({ type, user }) => ({ type: reverseRelationTypeMapping[type], user }));
    }

    async getUserRelationByType(from: string, to: string, type: RelationList) {
        const relation = await this.prismaService.usersRelations.findFirst({
            select: {
                type: true,
                user: {
                    include: {
                        userRelations: {
                            where: {
                                type: RelationList.Friendship,
                            },
                        },
                    },
                },
            },
            where: {
                targetUserUuid: from,
                userUuid: to,
                type: reverseRelationTypeMapping[type],
            },
        });

        return { type: reverseRelationTypeMapping[relation.type], user: relation.user };
    }

    async getAllRelationsBetweenUsers(from: string, to: string) {
        return await this.prismaService.usersRelations.findMany({
            where: {
                OR: [
                    {
                        userUuid: from,
                        targetUserUuid: to,
                    },
                    {
                        userUuid: to,
                        targetUserUuid: from,
                    },
                ],
            },
        });
    }

    async removeAllRelationsBetweenUsers(from: string, to: string) {
        return await this.prismaService.usersRelations.deleteMany({
            where: {
                OR: [
                    {
                        userUuid: from,
                        targetUserUuid: to,
                    },
                    {
                        userUuid: to,
                        targetUserUuid: from,
                    },
                ],
            },
        });
    }

    async removeRelationByType(from: string, to: string, typeFrom: RelationList, typeTo: RelationList) {
        return await this.prismaService.usersRelations.deleteMany({
            where: {
                OR: [
                    {
                        userUuid: from,
                        targetUserUuid: to,
                        type: typeFrom,
                    },
                    {
                        userUuid: to,
                        targetUserUuid: from,
                        type: typeTo,
                    },
                ],
            },
        });
    }

    async createTwoSideRelation(from: string, to: string, typeFrom: RelationList, typeTo: RelationList) {
        await this.prismaService.usersRelations.createMany({
            data: [
                { userUuid: from, targetUserUuid: to, type: typeFrom },
                { userUuid: to, targetUserUuid: from, type: typeTo },
            ],
        });
    }
}
