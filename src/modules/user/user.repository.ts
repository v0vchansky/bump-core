import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from '../../core/base/base.repository';
import { UserDocument, UserModel } from './schemas/user.schema';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
    constructor(@InjectModel(UserModel.name) private _userModel: Model<UserDocument>) {
        super(_userModel);
    }
}
