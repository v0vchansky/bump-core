import { Injectable, UseInterceptors } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import { v4 as uuidv4 } from 'uuid';

import { SentryInterceptor } from '../sentry/sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Injectable()
export class S3Service {
    constructor(@InjectS3() private readonly s3: S3) {}

    get bucketName() {
        return `bump-storage-${process.env.NODE_ENV}`;
    }

    get avatarsBucket() {
        return `${this.bucketName}/${process.env.S3_AVATARS_FOLDER}`;
    }

    private getKeyFromObject(avatarUrl: string) {
        return avatarUrl.replace(`https://storage.yandexcloud.net/${this.bucketName}/`, '');
    }

    async uploadAvatar(buffer: Buffer): Promise<string> {
        const response = await this.s3
            .upload({
                ACL: 'public-read',
                Key: `${uuidv4()}.jpg`,
                Body: buffer,
                Bucket: this.avatarsBucket,
            })
            .promise();

        return response.Location;
    }

    async deleteAvatar(avatarUrl: string | null): Promise<void> {
        await this.s3
            .deleteObject({
                Key: this.getKeyFromObject(avatarUrl),
                Bucket: this.bucketName,
            })
            .promise();
    }
}
