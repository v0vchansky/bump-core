import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { VerificationSendCodeDto } from './dto/verification-send-code.dto';
import { VerificationVerifyCodeDto } from './dto/verification-verify-code.dto';

@Injectable()
export class VerificationService {
    constructor(private readonly prismaService: PrismaService) {}

    async sendCode(dto: VerificationSendCodeDto): Promise<void> {
        const { phone } = dto;
        // - делаем запрос в api

        const apiResult = { code: '4444' };

        await this._createCode(apiResult.code, phone);
    }

    async verifyCode(dto: VerificationVerifyCodeDto): Promise<boolean> {
        const { code, phone } = dto;

        const result = await this.prismaService.verifications.findFirst({
            where: {
                phone: phone,
                code: code,
            },
        });

        if (result) {
            await this.prismaService.verifications.delete({ where: { uuid: result.uuid } });

            return true;
        }

        return false;
    }

    private async _createCode(code: string, phone: string): Promise<void> {
        const existedCode = await this.prismaService.verifications.findFirst({ where: { code, phone } });

        if (existedCode) {
            await this.prismaService.verifications.delete({ where: { uuid: existedCode.uuid } });
        }

        await this.prismaService.verifications.create({ data: { phone, code } });
    }
}
