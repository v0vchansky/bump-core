import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VerificationService } from './Verification.service';
import { VerificationModel, VerificationSchema } from './schemas/verification.schema';
import { VerificationRepository } from './verification.repository';

@Module({
    imports: [MongooseModule.forFeature([{ name: VerificationModel.name, schema: VerificationSchema }])],
    providers: [VerificationService, VerificationRepository],
    exports: [VerificationService, VerificationRepository],
})
export class VerificationModule {}
