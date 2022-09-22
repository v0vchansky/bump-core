import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from '../../core/base/base.repository';
import { VerificationDocument, VerificationModel } from './schemas/verification.schema';

@Injectable()
export class VerificationRepository extends BaseRepository<VerificationDocument> {
    constructor(@InjectModel(VerificationModel.name) private _verificationModel: Model<VerificationDocument>) {
        super(_verificationModel);
    }
}
