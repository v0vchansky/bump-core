import { MailerService as NativeMailerService } from '@nestjs-modules/mailer';
import { Injectable, UseInterceptors } from '@nestjs/common';

import { SentryInterceptor } from '../sentry/sentry.interceptor';
import { codeVerificationTemplate } from './templates/code-verification';

@UseInterceptors(SentryInterceptor)
@Injectable()
export class MailerService {
    constructor(private readonly nativeMailerService: NativeMailerService) {}

    private async send(to: string, from: string, subject: string, html: string) {
        await this.nativeMailerService.sendMail({
            to,
            from,
            subject,
            html,
        });
    }

    public async sendVerificationEmail(email: string, code: string): Promise<void> {
        await this.send(email, 'id@bump-family.ru', `Проверочный код ${code}`, codeVerificationTemplate(code));
    }
}
