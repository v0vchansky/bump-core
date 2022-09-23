import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserGetDto } from './dto/user-get.dto';
import { UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Post('getUser')
    async getUser(@Body() dto: UserGetDto): Promise<UserDocument | null> {
        return await this.userService.getUser(dto);
    }
}
