import { ShadowActions } from '@prisma/client';

export const enum ShadowAction {
    ForceSendGeolocaton = 'ForceSendGeolocaton',
    ForceGetLastUserLocation = 'ForceGetLastUserLocation',
    ForceUpdateUserFriends = 'ForceUpdateUserFriends',
}

type IForceSendGeolocatonPayload = null;

interface IForceGetLastUserLocationPayload {
    userUuid: string;
}

interface IForceUpdateUserFriendsPayload {
    deletedUserUuid: string;
}

export type ShadowActionPayload =
    | IForceSendGeolocatonPayload
    | IForceGetLastUserLocationPayload
    | IForceUpdateUserFriendsPayload
    | null;

export type OnCompleteAction = Omit<ShadowActions, 'uuid' | 'createdAt'>;
