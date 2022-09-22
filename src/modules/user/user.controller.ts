import { Body, Controller, Post } from '@nestjs/common';

import { UserGetDto } from './dto/user-get.dto';
import { UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('getUser')
    async getUser(@Body() dto: UserGetDto): Promise<UserDocument | null> {
        return await this.userService.getUser(dto);
    }
}
