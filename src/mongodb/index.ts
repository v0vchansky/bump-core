import { MongooseModule } from '@nestjs/mongoose';

const CERT_PATH = process.env.MONGO_DB_CERT_PATH;
// const USER_NAME = process.env.MONGO_USER_NAME;
// const USER_PASS = process.env.MONGO_USER_PASS;
// const HOST = process.env.MONGO_HOST;
// const DB_NAME = process.env.MONGO_DB_NAME;

// const uri = `mongodb://${USER_NAME}:${USER_PASS}@${HOST}/${DB_NAME}?replicaSet=rs01&authSource=${DB_NAME}&ssl=true`;

export const mongodb = MongooseModule.forRoot(
    'mongodb://developer:Tester01@rc1b-v5ppaimyaa9xl7i5.mdb.yandexcloud.net:27018/bump-development?replicaSet=rs01&authSource=bump-development&ssl=true',
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        ssl: true,
        sslValidate: true,
        sslCA: CERT_PATH || '/usr/local/share/ca-certificates/Yandex/YandexInternalRootCA.crt',
    },
);
