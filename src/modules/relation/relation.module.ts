import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { RelationRepository } from './relation.repository';
import { RelationService } from './relation.service';

@Module({
    imports: [PrismaModule],
    providers: [RelationService, RelationRepository],
    exports: [RelationService],
})
export class RelationModule {}
