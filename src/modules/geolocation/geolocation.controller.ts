import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Geolocations } from '@prisma/client';

import { InternalHttpException } from '../../core/http/internalHttpException';
import { InternalHttpResponse } from '../../core/http/internalHttpResponse';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseUser } from '../user/user.decorators';
import { GetLastUserLocationDto } from './dto/get-last-user-location';
import { RequestUpdateUsersLocationsDto } from './dto/request-update-users-locations.dto';
import { SetGeolocationDto } from './dto/set-geolocation.dto';
import { GeolocationService } from './geolocation.service';

@Controller('geolocation')
export class GeolocationController {
    constructor(private geolocationService: GeolocationService) {}

    @UseGuards(JwtAuthGuard)
    @Post('set_geolocations')
    async setGeolocations(
        @UseUser() user,
        @Body() dto: SetGeolocationDto,
    ): Promise<InternalHttpResponse<undefined> | InternalHttpException> {
        return await this.geolocationService.setGeolocation(dto, user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('set_geolocations_v2')
    async setGeolocationsV2(
        @UseUser() user,
        @Body() dto: SetGeolocationDto,
    ): Promise<InternalHttpResponse<undefined> | InternalHttpException> {
        return await this.geolocationService.setGeolocationV2(dto, user);
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
