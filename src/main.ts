import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SlackAdapter } from './slack/slack-adapter';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new SlackAdapter({
      signingSecret: process.env.SIGNING_SECRET,
      clientSecret: process.env.CLIENT_SECRET,
      clientId: process.env.CLIENT_ID,
      token: process.env.BOT_OAUTH_TOKEN,
    }),
  );
  await app.listen(3000);
}
bootstrap();
