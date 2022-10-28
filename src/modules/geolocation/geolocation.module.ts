import { Module, forwardRef } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { GeolocationController } from './geolocation.controller';
import { GeolocationService } from './geolocation.service';

@Module({
    imports: [PrismaModule, forwardRef(() => AuthModule)],
    controllers: [GeolocationController],
    providers: [GeolocationService],
})
export class GeolocationModule {}
