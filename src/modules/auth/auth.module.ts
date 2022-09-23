import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { VerificationModule } from '../Verification/Verification.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        VerificationModule,
        UserModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY || 'SECRET',
        }),
    ],
    exports: [JwtModule],
})
export class AuthModule {}
