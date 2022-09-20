import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mongodb } from './mongodb';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        mongodb,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
