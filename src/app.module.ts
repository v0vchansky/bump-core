import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mongodb } from './mongodb';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`,
        }),
        mongodb,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
