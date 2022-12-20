import { ShadowActions } from '@prisma/client';

export const enum ShadowAction {
    ForceSendGeolocaton = 'ForceSendGeolocaton',
}

export type OnCompleteAction = Omit<ShadowActions, 'uuid' | 'createdAt'>;
