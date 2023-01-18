import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { Geolocations } from '@prisma/client';

import { InternalHttpException } from '../../core/http/internalHttpException';
import { InternalHttpResponse } from '../../core/http/internalHttpResponse';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SentryInterceptor } from '../sentry/sentry.interceptor';
import { UseUser } from '../user/user.decorators';
import { GetLastUserLocationDto } from './dto/get-last-user-location';
import { RequestUpdateUsersLocationsDto } from './dto/request-update-users-locations.dto';
import { SetGeolocationDto } from './dto/set-geolocation.dto';
import { GeolocationService } from './geolocation.service';

@UseInterceptors(SentryInterceptor)
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

    @UseGuards(JwtAuthGuard)
    @Post('get_last_user_location')
    async getLastUserLocation(
        @UseUser() user,
        @Body() dto: GetLastUserLocationDto,
    ): Promise<InternalHttpResponse<Geolocations> | InternalHttpException> {
        return await this.geolocationService.getLastUserLocation(dto, user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('request_update_users_locations')
    async requestUpdateUsersLocations(
        @UseUser() user,
        @Body() dto: RequestUpdateUsersLocationsDto,
    ): Promise<InternalHttpResponse | InternalHttpException> {
        return await this.geolocationService.requestUpdateUsersLocations(dto, user);
    }
}
