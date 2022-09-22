import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { mongodb } from './core/mongodb';
import { VerificationModule } from './modules/Verification/Verification.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

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
