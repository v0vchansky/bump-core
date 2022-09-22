import { Injectable } from '@nestjs/common';

import { UserGetDto } from './dto/user-get.dto';
import { UserDocument } from './schemas/user.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getUser(dto: UserGetDto): Promise<UserDocument | null> {
        return await this.userRepository.findOne(dto);
    }
}
