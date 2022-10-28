import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
    const PORT = Number(process.env.PORT) || 3000;
    const app = await NestFactory.create(AppModule);

    // eslint-disable-next-line no-console
    await app.listen(PORT).then(() => console.log(`Server started on ${PORT}`));
}

bootstrap();
