import { Body, Controller, HttpException, Post } from '@nestjs/common';

import { UserDocument } from '../user/schemas/user.schema';
import { AuthService } from './auth.service';
import { IJWTTokenReponse } from './auth.types';
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
    async submitLogin(@Body() dto: AuthSubmitLoginDto): Promise<IJWTTokenReponse | HttpException> {
        return this.authService.submitLogin(dto);
    }
}
