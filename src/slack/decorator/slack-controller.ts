import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

export const SLACK_CONTROLLER = Symbol('SLACK_CONTROLLER');

export function SlackController(): ClassDecorator {
  return applyDecorators(SetMetadata(SLACK_CONTROLLER, true), Injectable);
}
