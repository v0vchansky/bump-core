import { ShadowActions } from '@prisma/client';

export const enum ShadowAction {
    ForceSendGeolocaton = 'ForceSendGeolocaton',
    ForceGetLastUserLocation = 'ForceGetLastUserLocation',
}

type IForceSendGeolocatonPayload = null;

interface IForceGetLastUserLocationPayload {
    userUuid: string;
}

export type ShadowActionPayload = IForceSendGeolocatonPayload | IForceGetLastUserLocationPayload | null;

export type OnCompleteAction = Omit<ShadowActions, 'uuid' | 'createdAt'>;
