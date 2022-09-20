import { MongooseModule } from '@nestjs/mongoose';

export const mongodb = MongooseModule.forRootAsync({
    useFactory: () => {
        const CERT_PATH = process.env.MONGO_DB_CERT_PATH;
        const USER_NAME = process.env.MONGO_USER_NAME;
        const USER_PASS = process.env.MONGO_USER_PASS;
        const HOST = process.env.MONGO_HOST;
        const DB_NAME = process.env.MONGO_DB_NAME;

        const uri = `mongodb://${USER_NAME}:${USER_PASS}@${HOST}/${DB_NAME}?replicaSet=rs01&authSource=${DB_NAME}&ssl=true`;

        return {
            uri,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            ssl: true,
            sslValidate: true,
            sslCA: CERT_PATH,
        };
    },
});
