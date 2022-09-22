import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { VerificationModule } from './modules/Verification/Verification.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { mongodb } from './mongodb';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        mongodb,
        UserModule,
        AuthModule,
        VerificationModule,
    ],
})
export class AppModule {}
