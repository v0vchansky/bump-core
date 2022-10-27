import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { VerificationService } from './Verification.service';

@Module({
    imports: [PrismaModule],
    providers: [VerificationService],
    exports: [VerificationService],
})
export class VerificationModule {}
