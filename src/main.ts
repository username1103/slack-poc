import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SlackAdapter } from './slack/slack-adapter';
import { App, ExpressReceiver, LogLevel } from '@slack/bolt';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // new SlackAdapter({
    //   signingSecret: process.env.SIGNING_SECRET,
    //   clientSecret: process.env.CLIENT_SECRET,
    //   clientId: process.env.CLIENT_ID,
    //   token: process.env.BOT_OAUTH_TOKEN,
    // }),
  );
  const express = app.getHttpAdapter().getInstance();
  const receiver = new ExpressReceiver({
    signingSecret: '833ceac41957bd1c41352023140facf8',
    clientId: '453217301505.6352523444162',
    clientSecret: '4bce9ce16983fca21e3efcedd6f79464',
    app: express,
  });

  const slackApp = new App({
    token: 'xoxb-453217301505-6349626811829-9kqqyvg9ND4DHJzvM4ZeFS6W',
    receiver,
    logLevel: LogLevel.DEBUG,
  });

  slackApp.command('/커맨드', async ({ ack }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await ack();
  });

  await app.listen(3000);
}
bootstrap();
