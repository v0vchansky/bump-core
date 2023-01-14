import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { VerificationService } from '../Verification/Verification.service';
import { MailerModule } from '../mailer/mailer.module';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { VerificationModule } from '../verification/verification.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, VerificationService, PrismaService],
    imports: [
        UserModule,
        VerificationModule,
        MailerModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY || 'SECRET',
        }),
    ],
    exports: [JwtModule],
})
export class AuthModule {}
