import { SlackMethod } from '../decorator/slack-method';

export interface MethodStrategy {
  route(slackController: any, methodName: string): void;

  support(slackMethod: SlackMethod): boolean;
}
