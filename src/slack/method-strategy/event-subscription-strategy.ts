import { PAYLOAD, SAY, SlackArgumentType } from '../decorator/slack-argument';
import { Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { SlackAdapter } from '../slack-adapter';
import { EVENT_SUBSCRIPTION, SlackMethod } from '../decorator/slack-method';
import { MethodStrategy } from './method-strategy';

@Injectable()
export class EventSubscriptionStrategy implements MethodStrategy {
  private readonly slackAdapter: SlackAdapter;

  constructor(httpAdapterHost: HttpAdapterHost) {
    this.slackAdapter = httpAdapterHost.httpAdapter as SlackAdapter;
  }

  route(slackController: any, methodName: string) {
    const eventName = Reflect.getMetadata(
      EVENT_SUBSCRIPTION,
      slackController,
      methodName,
    );

    if (!eventName) {
      throw new Error(
        `must have eventName in ${slackController?.name}.${methodName}`,
      );
    }

    const metadataKeys = Reflect.getMetadataKeys(slackController, methodName);
    this.slackAdapter.event(eventName, async ({ payload, say }) => {
      const args = [];

      metadataKeys.forEach((key) => {
        switch (key) {
          case PAYLOAD: {
            const index = Reflect.getMetadata(
              PAYLOAD,
              slackController,
              methodName,
            );
            args[index] = payload;
            break;
          }

          case SAY: {
            const index = Reflect.getMetadata(SAY, slackController, methodName);
            args[index] = say;
            break;
          }
          default:
            break;
        }
      });

      await slackController[methodName](...args);
    });
  }

  support(slackMethod: SlackMethod) {
    return slackMethod === EVENT_SUBSCRIPTION;
  }
}
