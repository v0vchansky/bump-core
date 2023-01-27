import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { ShadowActionsService } from '../shadow-actions/shadow-actions.service';
import { RelationRepository } from './relation.repository';
import { RelationService } from './relation.service';

@Module({
    imports: [PrismaModule],
    providers: [RelationService, RelationRepository, ShadowActionsService],
    exports: [RelationService],
})
export class RelationModule {}
