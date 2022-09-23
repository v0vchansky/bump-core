import { Moment } from 'moment';

export interface IJWTTokenReponse {
    token: string;
    endTime: Moment;
}

export interface ISubmitLoginResponse {
    accessToken: IJWTTokenReponse;
    refreshToken: IJWTTokenReponse;
}
