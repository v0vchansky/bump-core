import { Module, forwardRef } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RelationModule } from '../relation/relation.module';
import { RelationRepository } from '../relation/relation.repository';
import { RelationService } from '../relation/relation.service';
import { S3Service } from '../s3/s3.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [PrismaModule, forwardRef(() => AuthModule), RelationModule],
    controllers: [UserController],
    providers: [UserService, RelationService, RelationRepository, S3Service],
    exports: [UserService],
})
export class UserModule {}
