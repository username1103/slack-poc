import { MethodStrategy } from './method-strategy';
import {
  AUTO_ACK,
  COMMAND,
  EVENT_SUBSCRIPTION,
  SlackMethod,
} from '../decorator/slack-method';
import { PAYLOAD, RESPOND, SAY } from '../decorator/slack-argument';
import { SlackAdapter } from '../slack-adapter';
import { HttpAdapterHost } from '@nestjs/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommandStrategy implements MethodStrategy {
  private readonly slackAdapter: SlackAdapter;

  constructor(httpAdapterHost: HttpAdapterHost) {
    this.slackAdapter = httpAdapterHost.httpAdapter as SlackAdapter;
  }

  route(slackController: any, methodName: string): void {
    const commandName = Reflect.getMetadata(
      COMMAND,
      slackController,
      methodName,
    );

    const autoAck = Reflect.getMetadata(AUTO_ACK, slackController, methodName);

    if (!commandName) {
      throw new Error(
        `must have commandName in ${slackController?.name}.${methodName}`,
      );
    }

    const metadataKeys = Reflect.getMetadataKeys(slackController, methodName);
    this.slackAdapter.command(commandName, async ({ payload, say, ack }) => {
      if (autoAck) {
        await ack();
      }

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
          case RESPOND: {
            const index = Reflect.getMetadata(
              RESPOND,
              slackController,
              methodName,
            );
            args[index] = ack;
            break;
          }
          default:
            break;
        }
      });

      await slackController[methodName](...args);
    });
  }

  support(slackMethod: SlackMethod): boolean {
    return slackMethod === COMMAND;
  }
}
