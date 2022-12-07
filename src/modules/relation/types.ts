import { Users, UsersRelations } from '@prisma/client';

export const enum RelationList {
    OutgoingFriendRequest = 'OutgoingFriendRequest',
    IncomingFriendRequest = 'IncomingFriendRequest',
    Friendship = 'Friendship',
    Nobody = 'Nobody', // (никто, нет отношений) мета отношение, не лежит в базе, присваивается только по месту
    You = 'You', // (ты) мета отношение, не лежит в базе, присваивается только по месту
}

export const enum RelationRequestType {
    SendRequestToFriends = 'SendRequestToFriends',
    RejectFriendRequest = 'RejectFriendRequest',
    ResolveFriendRequest = 'ResolveFriendRequest',
    CancelFriendRequest = 'CancelFriendRequest',
    RemoveFromFriends = 'RemoveFromFriends',
}

export interface IGetUserRelation {
    type: RelationList | string;
    user: Users & {
        userRelations: UsersRelations[];
    };
}
