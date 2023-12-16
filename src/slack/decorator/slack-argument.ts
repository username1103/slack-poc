export type SlackArgumentType = typeof PAYLOAD | typeof SAY | typeof RESPOND;
export const PAYLOAD = Symbol('PAYLOAD');
export function Payload(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(PAYLOAD, parameterIndex, target, propertyKey);
  };
}

export const SAY = Symbol('SAY');
export function Say(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(SAY, parameterIndex, target, propertyKey);
  };
}

export const RESPOND = Symbol('RESPOND');

export function Respond(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    Reflect.defineMetadata(RESPOND, parameterIndex, target, propertyKey);
  };
}
