import { Module } from '@nestjs/common';
import { S3Module as S3 } from 'nestjs-s3';

import { S3Service } from './s3.service';

@Module({
    imports: [
        S3.forRootAsync({
            useFactory: () => ({
                config: {
                    accessKeyId: process.env.S3_ACCESS_KEY_ID,
                    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
                    endpoint: process.env.S3_ENDPOINT,
                    s3ForcePathStyle: true,
                    signatureVersion: 'v4',
                },
            }),
        }),
    ],

    controllers: [],
    providers: [S3Service],
    exports: [S3Service],
})
export class S3Module {}
