import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';

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

    async submitLogin(dto: AuthSubmitLoginDto): Promise<ISubmitLoginResponse | HttpException> {
        const { phone, userId, code } = dto;

        const isCorrectCode = await this.verificationService.verifyCode({ code, phone });

        if (isCorrectCode) {
            return {
                accessToken: this._generateAccessToken(phone, userId),
                refreshToken: this._generateRefreshToken(phone, userId),
            };
        }

        throw new HttpException('Неверный код', HttpStatus.BAD_REQUEST);
    }

    async authentication(dto: AuthAuthenticationDto): Promise<IJWTTokenReponse> {
        const { refreshToken } = dto;

        try {
            const payload = this.jwtService.verify(refreshToken);

            return this._generateAccessToken(payload.phone, payload.id);
        } catch (e) {
            throw new HttpException('Пользователь не авторизован', HttpStatus.UNAUTHORIZED);
        }
    }

    private _generateAccessToken(phone: string, id: string): IJWTTokenReponse {
        const payload = { id, phone };

        const seconds = 1800; // 30 минут

        return {
            token: this.jwtService.sign(payload, { expiresIn: seconds }),
            endTime: moment().add(seconds, 'seconds'),
        };
    }

    private _generateRefreshToken(phone: string, id: string): IJWTTokenReponse {
        const payload = { id, phone };

        const seconds = 31536000; // 1 год

        return {
            token: this.jwtService.sign(payload, { expiresIn: seconds }),
            endTime: moment().add(seconds, 'seconds'),
        };
    }
}
