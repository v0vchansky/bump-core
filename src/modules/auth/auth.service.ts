import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { addSeconds } from 'date-fns';
import * as admin from 'firebase-admin';
import { InternalHttpStatus } from 'src/core/http/internalHttpStatus';

import { InternalHttpException, InternalHttpExceptionErrorCode } from '../../core/http/internalHttpException';
import { InternalHttpResponse } from '../../core/http/internalHttpResponse';
import { DtoWithDateHeader } from '../../core/models/headers';
import { UserService } from '../user/user.service';
import { VerificationService } from '../verification/verification.service';
import { IJWTServiceVerifyPayloadResult, IJWTTokenReponse, ISubmitLoginResponse } from './auth.types';
import { AuthAuthenticationDto } from './dto/auth-authentication.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthSubmitLoginDto } from './dto/auth-submit-login.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private verificationService: VerificationService,
    ) {}

    async login(dto: AuthLoginDto): Promise<InternalHttpResponse<Users>> {
        const { phone, email } = dto;

        if (!phone && !email) {
            throw new InternalHttpException({
                status: InternalHttpStatus.BAD_REQUEST,
                message: 'Поля "Телефон" и "Email" обязательны',
            });
        }

        const user = await this.userService.createUserIfNotExist(phone, email);

        await this.verificationService.sendCode({ userUuid: user.uuid, email });

        return new InternalHttpResponse({ data: user });
    }

    async submitLogin(
        dto: DtoWithDateHeader<AuthSubmitLoginDto>,
    ): Promise<InternalHttpResponse<ISubmitLoginResponse> | HttpException> {
        const { email, code, date } = dto;

        if (!email) {
            throw new InternalHttpException({
                status: InternalHttpStatus.BAD_REQUEST,
                message: 'Поля "Телефон" и "Email" обязательны',
            });
        }

        const user = await this.userService.getUserByEmail(email);
        const isCorrectCode = await this.verificationService.verifyCode({ code, userUuid: user.uuid });

        if (isCorrectCode) {
            return new InternalHttpResponse<ISubmitLoginResponse>({
                data: {
                    user,
                    accessToken: this._generateAccessToken(user.uuid, email, date),
                    refreshToken: this._generateRefreshToken(user.uuid, email, date),
                },
            });
        }

        throw new InternalHttpException({
            errorCode: InternalHttpExceptionErrorCode.WrongAuthCode,
            message: 'Неверный код',
            status: InternalHttpStatus.BAD_REQUEST,
        });
    }

    async authentication(
        dto: DtoWithDateHeader<AuthAuthenticationDto>,
    ): Promise<InternalHttpResponse<IJWTTokenReponse>> {
        const { refreshToken, date } = dto;

        try {
            const payload = this.jwtService.verify<IJWTServiceVerifyPayloadResult>(refreshToken);
            const token = this._generateAccessToken(payload.uuid, payload.phone, date);

            return new InternalHttpResponse({ data: token });
        } catch (e) {
            const ref = admin.database().ref(`error`);

            await ref.push(JSON.stringify(dto));
            throw new InternalHttpException({
                errorCode: InternalHttpExceptionErrorCode.WrongRefreshToken,
                message: 'Пользователь не авторизован',
                status: InternalHttpStatus.UNAUTHORIZED,
            });
        }
    }

    private _generateAccessToken(uuid: string, email: string, date: string): IJWTTokenReponse {
        const payload = { uuid, email };

        const seconds = 15; // 1 час - 3600 секунд

        return {
            token: this.jwtService.sign(payload, { expiresIn: seconds }),
            endTime: addSeconds(new Date(date), seconds).toISOString(),
        };
    }

    private _generateRefreshToken(uuid: string, email: string, date: string): IJWTTokenReponse {
        const payload = { uuid, email };

        const seconds = 31536000 * 2; // 1 год - 31536000 секунд

        return {
            token: this.jwtService.sign(payload, { expiresIn: seconds }),
            endTime: addSeconds(new Date(date), seconds).toISOString(),
        };
    }
}
