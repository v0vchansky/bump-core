import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { VerificationModule } from './modules/Verification/Verification.module';
import { AuthModule } from './modules/auth/auth.module';
import { GeolocationModule } from './modules/geolocation/geolocation.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RelationModule } from './modules/relation/relation.module';
import { S3Module } from './modules/s3/s3.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        S3Module,
        UserModule,
        AuthModule,
        VerificationModule,
        GeolocationModule,
        PrismaModule,
        RelationModule,
    ],
})
export class AppModule {}
