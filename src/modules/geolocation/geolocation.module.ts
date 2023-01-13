import { Module, forwardRef } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RelationRepository } from '../relation/relation.repository';
import { ShadowActionsService } from '../shadow-actions/shadow-actions.service';
import { GeolocationController } from './geolocation.controller';
import { GeolocationService } from './geolocation.service';

@Module({
    imports: [PrismaModule, forwardRef(() => AuthModule)],
    controllers: [GeolocationController],
    providers: [GeolocationService, ShadowActionsService, RelationRepository],
})
export class GeolocationModule {}
