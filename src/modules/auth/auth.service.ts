import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { addSeconds } from 'date-fns';

import { InternalHttpException, InternalHttpExceptionErrorCode } from '../../core/http/internalHttpException';
import { DtoWithDateHeader } from '../../core/models/headers';
import { VerificationService } from '../Verification/Verification.service';
import { UserService } from '../user/user.service';
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

    async login(dto: AuthLoginDto) {
        const { phone } = dto;
        const user = await this.userService.createUserByPhoneIfNotExist(phone);

        await this.verificationService.sendCode({ phone });

        return user;
    }

    async submitLogin(dto: DtoWithDateHeader<AuthSubmitLoginDto>): Promise<ISubmitLoginResponse | HttpException> {
        const { phone, code, date } = dto;

        const isCorrectCode = await this.verificationService.verifyCode({ code, phone });
        const user = await this.userService.getUserByPhone(phone);

        if (isCorrectCode) {
            return {
                accessToken: this._generateAccessToken(user.uuid, phone, date),
                refreshToken: this._generateRefreshToken(user.uuid, phone, date),
            };
        }

        throw new InternalHttpException({
            errorCode: InternalHttpExceptionErrorCode.WrongAuthCode,
            message: 'Неверный код',
            status: HttpStatus.BAD_REQUEST,
        });
    }

    async authentication(dto: DtoWithDateHeader<AuthAuthenticationDto>): Promise<IJWTTokenReponse> {
        const { refreshToken, date } = dto;

        try {
            const payload = this.jwtService.verify<IJWTServiceVerifyPayloadResult>(refreshToken);

            return this._generateAccessToken(payload.uuid, payload.phone, date);
        } catch (e) {
            throw new InternalHttpException({
                errorCode: InternalHttpExceptionErrorCode.WrongRefreshToken,
                message: 'Пользователь не авторизован',
                status: HttpStatus.UNAUTHORIZED,
            });
        }
    }

    private _generateAccessToken(uuid: string, phone: string, date: string): IJWTTokenReponse {
        const payload = { uuid, phone };

        const seconds = 3600; // 1 час - 3600 секунд

        return {
            token: this.jwtService.sign(payload, { expiresIn: seconds }),
            endTime: addSeconds(new Date(date), seconds).toISOString(),
        };
    }

    private _generateRefreshToken(uuid: string, phone: string, date: string): IJWTTokenReponse {
        const payload = { uuid, phone };

        const seconds = 31536000 * 2; // 1 год - 31536000 секунд

        return {
            token: this.jwtService.sign(payload, { expiresIn: seconds }),
            endTime: addSeconds(new Date(date), seconds).toISOString(),
        };
    }
}
