import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import { Observable } from 'rxjs';
import { InternalHttpStatus } from 'src/core/http/internalHttpStatus';

import { InternalHttpException, InternalHttpExceptionErrorCode } from '../../core/http/internalHttpException';
import { IJWTServiceVerifyPayloadResult } from './auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();

        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];

            if (bearer !== 'Bearer' || !token) {
                const ref = admin.database().ref(`logout`);

                ref.push(`${token} ${JSON.stringify(req.headers)}`);

                throw new InternalHttpException({
                    errorCode: InternalHttpExceptionErrorCode.WrongAccessToken,
                    message: 'Пользователь не авторизован',
                    status: InternalHttpStatus.UNAUTHORIZED,
                });
            }

            const user = this.jwtService.verify<IJWTServiceVerifyPayloadResult>(token);

            req.userJwtPayload = user;

            return true;
        } catch (e) {
            throw new InternalHttpException({
                errorCode: InternalHttpExceptionErrorCode.WrongAccessToken,
                message: 'Пользователь не авторизован',
                status: InternalHttpStatus.UNAUTHORIZED,
            });
        }
    }
}
