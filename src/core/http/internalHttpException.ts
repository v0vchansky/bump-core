import { HttpException } from '@nestjs/common';

import { InternalHttpStatus } from './internalHttpStatus';

export const enum InternalHttpExceptionErrorCode {
    WrongAuthCode = 'wrong_auth_code',
    WrongRefreshToken = 'wrong_refresh_token',
    WrongAccessToken = 'wrong_access_token',
    NonUnique = 'non_unique',
}

interface IInternalHttpException {
    status: InternalHttpStatus;
    message: string;
    errorCode?: InternalHttpExceptionErrorCode;
}

export class InternalHttpException extends HttpException {
    constructor({ errorCode, message, status }: IInternalHttpException) {
        super({ data: { errorCode, message }, statusCode: status }, status);
    }
}
