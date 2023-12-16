import { Module, OnModuleInit } from '@nestjs/common';
import {
  DiscoveryModule,
  DiscoveryService,
  MetadataScanner,
} from '@nestjs/core';
import { SLACK_CONTROLLER } from './slack/decorator/slack-controller';
import { SampleModule } from './sample/sample.module';
import {
  COMMAND,
  EVENT_SUBSCRIPTION,
  SlackMethod,
} from './slack/decorator/slack-method';
import { EventSubscriptionStrategy } from './slack/method-strategy/event-subscription-strategy';
import { CommandStrategy } from './slack/method-strategy/command-strategy';
import { AppController } from './app.controller';

@Module({
  imports: [DiscoveryModule, SampleModule],
  controllers: [AppController],
  providers: [EventSubscriptionStrategy, CommandStrategy],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly eventSubscriptionStrategy: EventSubscriptionStrategy,
    private readonly commandStrategy: CommandStrategy,
  ) {}

  onModuleInit() {
    // const slackControllers = this.discoveryService
    //   .getProviders()
    //   .filter(
    //     (wrapper) =>
    //       wrapper.metatype &&
    //       Reflect.hasMetadata(SLACK_CONTROLLER, wrapper.metatype),
    //   );
    //
    // slackControllers.forEach((wrapper) => {
    //   const slackController = wrapper.instance;
    //   const methods = this.metadataScanner.getAllMethodNames(slackController);
    //
    //   methods.forEach((method) => {
    //     const metadataKeys = Reflect.getMetadataKeys(
    //       slackController,
    //       method,
    //     ) as SlackMethod[];
    //
    //     metadataKeys.forEach((key) => {
    //       switch (key) {
    //         case EVENT_SUBSCRIPTION:
    //           this.eventSubscriptionStrategy.route(slackController, method);
    //           break;
    //         case COMMAND:
    //           this.commandStrategy.route(slackController, method);
    //           break;
    //         default:
    //           break;
    //       }
    //     });
    //   });
    // });
  }
}
