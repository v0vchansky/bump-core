// import { Moment } from 'moment';

export interface IJWTTokenReponse {
    token: string;
    endTime: string;
}

export interface ISubmitLoginResponse {
    accessToken: IJWTTokenReponse;
    refreshToken: IJWTTokenReponse;
}
