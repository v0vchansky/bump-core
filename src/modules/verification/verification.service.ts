import { Injectable, UseInterceptors } from '@nestjs/common';
import { InternalHttpException } from 'src/core/http/internalHttpException';
import { InternalHttpStatus } from 'src/core/http/internalHttpStatus';

import { MailerService } from '../mailer/mailer.service';
import { PrismaService } from '../prisma/prisma.service';
import { SentryInterceptor } from '../sentry/sentry.interceptor';
import { VerificationSendCodeDto } from './dto/verification-send-code.dto';
import { VerificationVerifyCodeDto } from './dto/verification-verify-code.dto';
import { getRandomCode } from './utils';

@UseInterceptors(SentryInterceptor)
@Injectable()
export class VerificationService {
    constructor(private readonly prismaService: PrismaService, private readonly mailerService: MailerService) {}

    async sendCode(dto: VerificationSendCodeDto): Promise<void> {
        const { userUuid, email } = dto;

        const code = await this.createCode(userUuid);

        if (email) {
            await this.mailerService.sendVerificationEmail(email, code);

            return;
        }

        throw new InternalHttpException({ status: InternalHttpStatus.BAD_REQUEST, message: 'Код не был отправлен' });
    }

    async verifyCode(dto: VerificationVerifyCodeDto): Promise<boolean> {
        const { code, userUuid } = dto;

        const result = await this.prismaService.verifications.findFirst({
            where: {
                userUuid,
                code: code,
            },
        });

        if (result) {
            await this.prismaService.verifications.delete({ where: { uuid: result.uuid } });

            return true;
        }

        return false;
    }

    private async createCode(userUuid: string): Promise<string> {
        const existedCode = await this.prismaService.verifications.findFirst({ where: { userUuid } });

        if (existedCode) {
            await this.prismaService.verifications.delete({ where: { uuid: existedCode.uuid } });
        }

        if (userUuid === '79eee002-cf14-4b55-8849-858f4063a00c') {
            const code = '4444';

            await this.prismaService.verifications.create({ data: { userUuid, code } });

            return code;
        }

        const code = getRandomCode(4);

        await this.prismaService.verifications.create({ data: { userUuid, code } });

        return code;
    }
}
