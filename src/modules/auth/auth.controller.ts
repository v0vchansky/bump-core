import { Body, Controller, Headers, Post, UseInterceptors } from '@nestjs/common';
import { Users } from '@prisma/client';

import { InternalHttpException } from '../../core/http/internalHttpException';
import { InternalHttpResponse } from '../../core/http/internalHttpResponse';
import { ReqHeaders } from '../../core/models/headers';
import { SentryInterceptor } from '../sentry/sentry.interceptor';
import { AuthService } from './auth.service';
import { IJWTTokenReponse, IRNBGJWTResponse, ISubmitLoginResponse } from './auth.types';
import { AuthAuthenticationDto } from './dto/auth-authentication.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthSubmitLoginDto } from './dto/auth-submit-login.dto';

@UseInterceptors(SentryInterceptor)
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() dto: AuthLoginDto): Promise<InternalHttpResponse<Users>> {
        return await this.authService.login(dto);
    }

    @Post('submit_login')
    async submitLogin(
        @Headers() headers: ReqHeaders,
        @Body() dto: AuthSubmitLoginDto,
    ): Promise<InternalHttpResponse<ISubmitLoginResponse> | InternalHttpException> {
        return this.authService.submitLogin({ ...dto, date: headers.date });
    }

    @Post('authentication')
    async authentication(
        @Headers() headers: ReqHeaders,
        @Body() dto: AuthAuthenticationDto,
    ): Promise<InternalHttpResponse<IJWTTokenReponse> | InternalHttpException> {
        return await this.authService.authentication({ ...dto, date: headers.date });
    }

    @Post('authenticationRNBG')
    async authenticationRNBG(
        @Headers() headers: ReqHeaders,
        @Body() dto: AuthAuthenticationDto,
    ): Promise<InternalHttpResponse<IRNBGJWTResponse>> {
        return await this.authService.authenticationRNBG({ ...dto, date: headers.date });
    }
}
