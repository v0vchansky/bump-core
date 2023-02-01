import { Users } from '@prisma/client';

export interface IJWTTokenReponse {
    token: string;
    endTime: string;
}

export interface ISubmitLoginResponse {
    user: Users;
    accessToken: IJWTTokenReponse;
    refreshToken: IJWTTokenReponse;
}

export interface IJWTServiceVerifyPayloadResult {
    uuid: string;
    phone: string;
}

export interface IRNBGJWTResponse {
    accessToken: string;
    refreshToken: string;
}
