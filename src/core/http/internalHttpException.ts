import { HttpException } from '@nestjs/common';

import { InternalHttpStatus } from './internalHttpStatus';

export const enum InternalHttpExceptionErrorCode {
    WrongAuthCode = 'wrong_auth_code',
    WrongRefreshToken = 'wrong_refresh_token',
    WrongAccessToken = 'wrong_access_token',
    NonUnique = 'non_unique',
    NeedForceUpdateRelations = 'need_force_update_relations',
    UserIsNotFriend = 'user_is_not_friend',
    UserNotHaveCoordinates = 'user_not_have_coordinates'
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
