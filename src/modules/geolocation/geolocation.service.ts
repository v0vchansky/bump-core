import { Injectable } from '@nestjs/common';
import { InternalHttpResponse } from 'src/core/http/internalHttpResponse';

import { IJWTServiceVerifyPayloadResult } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { SetGeolocationDto } from './dto/set-geolocation.dto';

@Injectable()
export class GeolocationService {
    constructor(private readonly prismaService: PrismaService) {}

    async setGeolocation(dto: SetGeolocationDto, user: IJWTServiceVerifyPayloadResult) {
        const res = await this.prismaService.geolocations.createMany({
            data: dto.points.map(data => ({ ...data, localTime: new Date(data.localTime), userUuid: user.uuid })),
        });

        return new InternalHttpResponse({ data: res });
    }
}
