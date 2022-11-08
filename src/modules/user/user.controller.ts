import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Users } from '@prisma/client';
import { InternalHttpResponse } from 'src/core/http/internalHttpResponse';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SetProfileInfoDto } from './dto/set-profile-info.dto';
import { UseUser } from './user.decorators';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Post('get_user')
    async setUser(@UseUser() user): Promise<InternalHttpResponse<Users>> {
        return await this.userService.getUser(user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('set_profile_info')
    async setProfileInfo(@UseUser() user, @Body() dto: SetProfileInfoDto): Promise<InternalHttpResponse> {
        return await this.userService.setProfileInfo(dto, user);
    }
}
