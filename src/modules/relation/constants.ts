import { RelationList } from './types';

export const reverseRelationTypeMapping = {
    [RelationList.Friendship]: RelationList.Friendship,
    [RelationList.IncomingFriendRequest]: RelationList.OutgoingFriendRequest,
    [RelationList.OutgoingFriendRequest]: RelationList.IncomingFriendRequest,
};
