import { MailerService as NativeMailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { codeVerificationTemplate } from './templates/code-verification';

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
