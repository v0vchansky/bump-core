import { NestFactory } from '@nestjs/core';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

import { AppModule } from './app.module';

async function bootstrap() {
    const PORT = Number(process.env.PORT) || 3000;
    const app = await NestFactory.create(AppModule);

    const adminConfig: ServiceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    admin.initializeApp({
        credential: admin.credential.cert(adminConfig),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    // eslint-disable-next-line no-console
    await app.listen(PORT).then(() => console.log(`Server started on ${PORT}`));
}

bootstrap();
