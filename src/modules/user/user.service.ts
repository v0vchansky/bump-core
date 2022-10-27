import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { UserGetDto } from './dto/user-get.dto';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async createUserByPhoneIfNotExist(phone: string) {
        const user = await this.prismaService.users.findFirst({ where: { phone } });

        if (!user) {
            const user = await this.prismaService.users.create({ data: { phone } });

            return user;
        }

        return false;
    }

    async getUser(dto: UserGetDto) {
        return await this.prismaService.users.findFirst({
            where: {
                uuid: dto.userId,
            },
        });
    }
}
