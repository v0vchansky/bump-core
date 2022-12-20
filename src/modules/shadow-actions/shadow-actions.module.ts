import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ShadowActionsController } from './shadow-actions.controller';
import { ShadowActionsService } from './shadow-actions.service';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ShadowActionsController],
    providers: [ShadowActionsService],
    exports: [],
})
export class ShadowActionsModule {}
