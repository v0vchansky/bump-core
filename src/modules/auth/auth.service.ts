import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { VerificationService } from '../Verification/Verification.service';
import { UserDocument } from '../user/schemas/user.schema';
import { UserRepository } from '../user/user.repository';
import { IJWTTokenReponse } from './auth.types';
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

    async submitLogin(dto: AuthSubmitLoginDto): Promise<IJWTTokenReponse | HttpException> {
        const { phone, userId, code } = dto;

        const isCorrectCode = await this.verificationService.verifyCode({ code, phone });

        if (isCorrectCode) {
            return this._generateToken(phone, userId);
        }

        throw new HttpException('Неверный код', HttpStatus.BAD_REQUEST);
    }

    private _generateToken(phone: string, id: string): IJWTTokenReponse {
        const payload = { id, phone };

        return {
            token: this.jwtService.sign(payload),
        };
    }
}
