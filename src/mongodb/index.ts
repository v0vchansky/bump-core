import { MongooseModule } from '@nestjs/mongoose';

export const mongodb = MongooseModule.forRootAsync({
    useFactory: () => {
        const {
            MONGO_DB_CERT_PATH: CERT_PATH,
            MONGO_USER_NAME: USER_NAME,
            MONGO_USER_PASS: USER_PASS,
            MONGO_HOST: HOST,
            MONGO_DB_NAME: DB_NAME,
        } = process.env;

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
