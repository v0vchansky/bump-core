import { Module } from '@nestjs/common';

import { MailerService } from '../mailer/mailer.service';
import { PrismaModule } from '../prisma/prisma.module';
import { VerificationService } from './verification.service';

@Module({
    imports: [PrismaModule],
    providers: [VerificationService, MailerService],
    exports: [VerificationService],
})
export class VerificationModule {}
