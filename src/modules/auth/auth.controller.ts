import { Body, Controller, Headers, HttpException, Post } from '@nestjs/common';

import { ReqHeaders } from '../../core/models/headers';
import { AuthService } from './auth.service';
import { ISubmitLoginResponse } from './auth.types';
import { AuthAuthenticationDto } from './dto/auth-authentication.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthSubmitLoginDto } from './dto/auth-submit-login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() dto: AuthLoginDto) {
        return await this.authService.login(dto);
    }

    @Post('submit_login')
    async submitLogin(
        @Headers() headers: ReqHeaders,
        @Body() dto: AuthSubmitLoginDto,
    ): Promise<ISubmitLoginResponse | HttpException> {
        return this.authService.submitLogin({ ...dto, date: headers.date });
    }

    @Post('authentication')
    async authentication(@Headers() headers: ReqHeaders, @Body() dto: AuthAuthenticationDto) {
        return await this.authService.authentication({ ...dto, date: headers.date });
    }
}
