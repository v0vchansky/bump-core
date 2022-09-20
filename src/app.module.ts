import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        // MongooseModule.forRoot(
        //     'mongodb://developer:Tester01@rc1b-6fuift4umjrvb4fj.mdb.yandexcloud.net:27018/?replicaSet=rs01&authSource=bump-development',
        // ),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
