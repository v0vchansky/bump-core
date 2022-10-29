import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { UserGetDto } from './dto/user-get.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async _createUserByPhoneIfNotExist(phone: string) {
        let user = await this.prismaService.users.findFirst({ where: { phone } });

        if (!user) {
            user = await this.prismaService.users.create({ data: { phone } });
        }

        return user;
    }

    async getUser(dto: UserGetDto) {
        return await this.prismaService.users.findFirst({
            where: {
                uuid: dto.userId,
            },
        });
    }

    async getUserByPhone(phone: string) {
        return await this.prismaService.users.findFirst({
            where: {
                phone,
            },
        });
    }
}
