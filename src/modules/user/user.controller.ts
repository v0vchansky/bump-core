import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InternalHttpException } from 'src/core/http/internalHttpException';
import { InternalHttpResponse } from 'src/core/http/internalHttpResponse';

import { IJWTServiceVerifyPayloadResult } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IGetUserRelation, IUserWithRelations } from '../relation/types';
import { SentryInterceptor } from '../sentry/sentry.interceptor';
import { GetRelationsByTypeDto } from './dto/get-relations-by-type.dto';
import { SearchByUsernameDto } from './dto/search-by-username.dto';
import { SendRelationRequestDto } from './dto/send-relation-request.dto';
import { SetProfileInfoDto } from './dto/set-profile-info.dto';
import { UseUser } from './user.decorators';
import { UserService } from './user.service';

@UseInterceptors(SentryInterceptor)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Post('get_user')
    async setUser(@UseUser() user: IJWTServiceVerifyPayloadResult): Promise<InternalHttpResponse<IUserWithRelations>> {
        return await this.userService.getUser(user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('set_profile_info')
    async setProfileInfo(
        @UseUser() user: IJWTServiceVerifyPayloadResult,
        @Body() dto: SetProfileInfoDto,
    ): Promise<InternalHttpResponse> {
        return await this.userService.setProfileInfo(dto, user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('search_by_username')
    async searchByUsername(
        @UseUser() user: IJWTServiceVerifyPayloadResult,
        @Body() dto: SearchByUsernameDto,
    ): Promise<InternalHttpResponse<IGetUserRelation[]>> {
        return await this.userService.searchByUsername(dto, user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('send_relation_request')
    async sendRelationRequest(
        @UseUser() user: IJWTServiceVerifyPayloadResult,
        @Body() dto: SendRelationRequestDto,
    ): Promise<InternalHttpResponse | InternalHttpResponse<IGetUserRelation> | InternalHttpException> {
        return await this.userService.sendRelationRequest(dto, user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('get_relations_by_type')
    async getUserRelations(
        @UseUser() user: IJWTServiceVerifyPayloadResult,
        @Body() dto: GetRelationsByTypeDto,
    ): Promise<InternalHttpResponse<IGetUserRelation[]>> {
        return await this.userService.getRelationsByType(dto.uuid || user.uuid, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload_avatar')
    @UseInterceptors(FileInterceptor('image'))
    async uploadAvatar(
        @UseUser() user: IJWTServiceVerifyPayloadResult,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<InternalHttpResponse<string>> {
        return await this.userService.uploadAvatar(user, file);
    }

    @UseGuards(JwtAuthGuard)
    @Post('delete_avatar')
    async deleteAvatar(@UseUser() user: IJWTServiceVerifyPayloadResult): Promise<InternalHttpResponse> {
        return await this.userService.deleteAvatar(user);
    }
}
