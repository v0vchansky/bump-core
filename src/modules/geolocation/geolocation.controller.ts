import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { InternalHttpException } from '../../core/http/internalHttpException';
import { InternalHttpResponse } from '../../core/http/internalHttpResponse';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseUser } from '../user/user.decorators';
import { SetGeolocationDto } from './dto/set-geolocation.dto';
import { GeolocationService } from './geolocation.service';

@Controller('geolocation')
export class GeolocationController {
    constructor(private geolocationService: GeolocationService) {}

    @UseGuards(JwtAuthGuard)
    @Post('set_geolocations')
    async login(
        @UseUser() user,
        @Body() dto: SetGeolocationDto,
    ): Promise<InternalHttpResponse<undefined> | InternalHttpException> {
        return await this.geolocationService.setGeolocation(dto, user);
    }
}
