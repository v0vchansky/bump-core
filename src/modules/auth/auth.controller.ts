import { Body, Controller, HttpException, Post } from '@nestjs/common';

import { UserDocument } from '../user/schemas/user.schema';
import { AuthService } from './auth.service';
import { ISubmitLoginResponse } from './auth.types';
import { AuthAuthenticationDto } from './dto/auth-authentication.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthSubmitLoginDto } from './dto/auth-submit-login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() dto: AuthLoginDto): Promise<UserDocument> {
        return await this.authService.login(dto);
    }

    @Post('submitLogin')
    async submitLogin(@Body() dto: AuthSubmitLoginDto): Promise<ISubmitLoginResponse | HttpException> {
        return this.authService.submitLogin(dto);
    }

    @Post('authentication')
    async authentication(@Body() dto: AuthAuthenticationDto) {
        return await this.authService.authentication(dto);
    }
}
