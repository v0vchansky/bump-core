import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';

import { IJWTServiceVerifyPayloadResult } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SentryInterceptor } from '../sentry/sentry.interceptor';
import { UseUser } from '../user/user.decorators';
import { CompleteShadowActionDto } from './dto/complete-shadow-action.dto';
import { GetShadowActionDto } from './dto/get-shadow-action.dto';
import { ShadowActionsService } from './shadow-actions.service';

@UseInterceptors(SentryInterceptor)
@Controller('shadow_actions')
export class ShadowActionsController {
    constructor(private shadowActionsService: ShadowActionsService) {}

    @UseGuards(JwtAuthGuard)
    @Post('get_action')
    async getShadowAction(@UseUser() user: IJWTServiceVerifyPayloadResult, @Body() dto: GetShadowActionDto) {
        return await this.shadowActionsService.getShadowAction(dto.actionUuid, user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('complete_action')
    async completeShadowAction(@UseUser() user: IJWTServiceVerifyPayloadResult, @Body() dto: CompleteShadowActionDto) {
        return await this.shadowActionsService.completeShadowAction(dto, user);
    }
}
