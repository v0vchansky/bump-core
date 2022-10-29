import { HttpStatus, Injectable } from '@nestjs/common';
import { InternalHttpException } from 'src/core/http/internalHttpException';
import { InternalHttpResponse } from 'src/core/http/internalHttpResponse';

import { IJWTServiceVerifyPayloadResult } from '../auth/auth.types';
import { PrismaService } from '../prisma/prisma.service';
import { SetGeolocationDto } from './dto/set-geolocation.dto';

@Injectable()
export class GeolocationService {
    constructor(private readonly prismaService: PrismaService) {}

    async setGeolocation(dto: SetGeolocationDto, user: IJWTServiceVerifyPayloadResult) {
        try {
            await this.prismaService.geolocations.createMany({
                data: dto.points.map(data => ({ ...data, localTime: new Date(data.localTime), userUuid: user.uuid })),
            });

            return new InternalHttpResponse({ data: undefined });
        } catch (_e) {
            throw new InternalHttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Не удалось добавить точки геолокаций',
            });
        }
    }
}
