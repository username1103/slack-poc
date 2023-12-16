export type SlackMethod = typeof EVENT_SUBSCRIPTION | typeof COMMAND;

export const AUTO_ACK = Symbol('AUTO_ACK');
export const EVENT_SUBSCRIPTION = Symbol('EVENT_SUBSCRIPTION');
export function EventSubscription(eventName: string): MethodDecorator {
  return (target, propertyKey, _) => {
    Reflect.defineMetadata(EVENT_SUBSCRIPTION, eventName, target, propertyKey);
  };
}

export const COMMAND = Symbol('COMMAND');

export function Command(
  commandName: string,
  isAutoAck = true,
): MethodDecorator {
  return (target, propertyKey, _) => {
    Reflect.defineMetadata(COMMAND, commandName, target, propertyKey);
    Reflect.defineMetadata(AUTO_ACK, isAutoAck, target, propertyKey);
  };
}
