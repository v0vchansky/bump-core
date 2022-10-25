import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { addSeconds } from 'date-fns';
import { InternalHttpException, InternalHttpExceptionErrorCode } from 'src/core/http/internalHttpException';
import { DtoWithDateHeader } from 'src/core/models/headers';

import { VerificationService } from '../Verification/Verification.service';
import { UserDocument } from '../user/schemas/user.schema';
import { UserRepository } from '../user/user.repository';
import { IJWTTokenReponse, ISubmitLoginResponse } from './auth.types';
import { AuthAuthenticationDto } from './dto/auth-authentication.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthSubmitLoginDto } from './dto/auth-submit-login.dto';

@Injectable()
export class AuthService {
    constructor(
        private verificationService: VerificationService,
        private jwtService: JwtService,
        private userRepository: UserRepository,
    ) {}

    async login(dto: AuthLoginDto): Promise<UserDocument> {
        const { phone } = dto;
        let user = await this.userRepository.findOne({ phone });

        if (!user) {
            user = await this.userRepository.create(dto);
        }

        await this.verificationService.sendCode({ phone });

        return user;
    }

    async submitLogin(dto: DtoWithDateHeader<AuthSubmitLoginDto>): Promise<ISubmitLoginResponse | HttpException> {
        const { phone, code, date } = dto;

        const isCorrectCode = await this.verificationService.verifyCode({ code, phone });

        if (isCorrectCode) {
            return {
                accessToken: this._generateAccessToken(phone, date),
                refreshToken: this._generateRefreshToken(phone, date),
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
            const payload = this.jwtService.verify(refreshToken);

            return this._generateAccessToken(payload.phone, date);
        } catch (e) {
            throw new InternalHttpException({
                errorCode: InternalHttpExceptionErrorCode.WrongRefreshToken,
                message: 'Пользователь не авторизован',
                status: HttpStatus.UNAUTHORIZED,
            });
        }
    }

    private _generateAccessToken(phone: string, date: string): IJWTTokenReponse {
        const payload = { phone };

        const seconds = 3600; // 1 час - 3600 секунд

        return {
            token: this.jwtService.sign(payload, { expiresIn: seconds }),
            endTime: addSeconds(new Date(date), seconds).toISOString(),
        };
    }

    private _generateRefreshToken(phone: string, date: string): IJWTTokenReponse {
        const payload = { phone };

        const seconds = 31536000 * 2; // 1 год - 31536000 секунд

        return {
            token: this.jwtService.sign(payload, { expiresIn: seconds }),
            endTime: addSeconds(new Date(date), seconds).toISOString(),
        };
    }
}
