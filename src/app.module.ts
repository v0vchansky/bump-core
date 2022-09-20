import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mongodb } from './mongodb';

@Module({
    imports: [mongodb],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
