export interface IJWTTokenReponse {
    token: string;
    endTime: string;
}

export interface ISubmitLoginResponse {
    accessToken: IJWTTokenReponse;
    refreshToken: IJWTTokenReponse;
}

export interface IJWTServiceVerifyPayloadResult {
    uuid: string;
    phone: string;
}
