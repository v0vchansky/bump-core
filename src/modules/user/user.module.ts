import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { UserModel, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]), forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService, UserRepository],
})
export class UserModule {}
