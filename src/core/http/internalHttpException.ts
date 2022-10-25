import { HttpException, HttpStatus } from '@nestjs/common';

export const enum InternalHttpExceptionErrorCode {
    WrongAuthCode = 'wrong_auth_code',
    WrongRefreshToken = 'wrong_refresh_token',
    WrongAccessToken = 'wrong_access_token',
}

interface IInternalHttpException {
    status: HttpStatus;
    message: string;
    errorCode?: InternalHttpExceptionErrorCode;
}

export class InternalHttpException extends HttpException {
    constructor({ errorCode, message, status }: IInternalHttpException) {
        super({ data: { errorCode, message }, statusCode: status }, status);
    }
}
