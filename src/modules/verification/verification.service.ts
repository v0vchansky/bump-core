import { Injectable } from '@nestjs/common';

import { VerificationSendCodeDto } from './dto/verification-send-code.dto';
import { VerificationVerifyCodeDto } from './dto/verification-verify-code.dto';
import { VerificationRepository } from './verification.repository';

@Injectable()
export class VerificationService {
    constructor(private verificationRepository: VerificationRepository) {}

    async sendCode(dto: VerificationSendCodeDto): Promise<void> {
        const { phone } = dto;
        // - делаем запрос в api

        const apiResult = { code: '4444' };

        await this._createCode(apiResult.code, phone);
    }

    async verifyCode(dto: VerificationVerifyCodeDto): Promise<boolean> {
        const { code, phone } = dto;
        const result = await this.verificationRepository.findOne({ phone: phone, code: code });

        if (result) {
            await this.verificationRepository.deleteOne({ code });

            return true;
        }

        return false;
    }

    private async _createCode(code: string, phone: string): Promise<void> {
        const isCodeExist = Boolean(await this.verificationRepository.findOne({ code, phone }));

        if (isCodeExist) {
            await this.verificationRepository.deleteOne({ code, phone });
        }

        await this.verificationRepository.create({ phone, code });
    }
}
