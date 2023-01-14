import { MailerModule as NativeMailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

import { MailerService } from './mailer.service';

@Module({
    imports: [
        NativeMailerModule.forRootAsync({
            useFactory: () => ({
                transport: `smtps://${process.env.MAILER_USER}:${process.env.MAILER_PASS}@${process.env.MAILER_HOST}`,
            }),
        }),
    ],
    controllers: [],
    providers: [MailerService],
    exports: [MailerService],
})
export class MailerModule {}
