import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import * as firebase from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

import { AppModule } from './app.module';

async function bootstrap() {
    const PORT = Number(process.env.PORT) || 80;
    const app = await NestFactory.create(AppModule);

    const adminConfig: ServiceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    firebase.initializeApp({
        credential: firebase.credential.cert(adminConfig),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
    });

    // eslint-disable-next-line no-console
    await app.listen(PORT).then(() => console.log(`Server started on ${PORT}`));
}

bootstrap();
