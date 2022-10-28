import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { VerificationModule } from './modules/Verification/Verification.module';
import { AuthModule } from './modules/auth/auth.module';
import { GeolocationModule } from './modules/geolocation/geolocation.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        UserModule,
        AuthModule,
        VerificationModule,
        GeolocationModule,
        PrismaModule,
    ],
})
export class AppModule {}
