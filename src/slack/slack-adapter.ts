import { AbstractHttpAdapter } from '@nestjs/core';
import {
  App,
  ExpressReceiver,
  ExpressReceiverOptions,
  LogLevel,
} from '@slack/bolt';
import { Logger, NestApplicationOptions, RequestMethod } from '@nestjs/common';
import * as https from 'https';
import * as http from 'http';
import { Duplex } from 'stream';
import { NotImplementException } from './not-implement-exception';
import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt/dist/types';
import { SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types/command';

export class SlackAdapter extends AbstractHttpAdapter {
  private app: App;

  private readonly logger = new Logger(SlackAdapter.name);
  private readonly openConnections = new Set<Duplex>();

  constructor(options: ExpressReceiverOptions & { token?: string }) {
    const expressReceiver = new ExpressReceiver(options);
    super(expressReceiver.app);
    this.app = new App({
      receiver: expressReceiver,
      token: options.token,
      logLevel: LogLevel.DEBUG,
    });
  }

  event(eventName: string, handler: Middleware<SlackEventMiddlewareArgs>) {
    this.app.event(eventName, handler);
  }

  command(
    commandName: string,
    handler: Middleware<SlackCommandMiddlewareArgs>,
  ) {
    this.app.command(commandName, handler);
  }

  close(): any {
    return this.app.stop();
  }

  initHttpServer(options: NestApplicationOptions): any {
    const isHttpsEnabled = options && options.httpsOptions;
    if (isHttpsEnabled) {
      this.httpServer = https.createServer(
        options.httpsOptions,
        this.getInstance(),
      );
    } else {
      this.httpServer = http.createServer(this.getInstance());
    }

    if (options?.forceCloseConnections) {
      this.trackOpenConnections();
    }
  }

  getRequestHostname(request: any): any {
    return request.hostname;
  }

  getRequestMethod(request: any): any {
    return request.method;
  }

  getRequestUrl(request: any): any {
    return request.url;
  }

  status(response: any, statusCode: number): any {
    return response.status(statusCode);
  }

  reply(response: any, body: any, statusCode?: number): any {
    if (statusCode) {
      response.status(statusCode);
    }

    response.json(body);
  }

  end(response: any, message?: string): any {
    return response.end(message);
  }

  redirect(response: any, statusCode: number, url: string): any {
    return response.redirect(statusCode, url);
  }

  isHeadersSent(response: any): any {
    return response.headersSent;
  }

  setHeader(response: any, name: string, value: string): any {
    return response.set(name, value);
  }

  getType(): string {
    return 'slack';
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  setErrorHandler(handler: Function, prefix?: string): any {
    // NOTHING
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  setNotFoundHandler(handler: Function, prefix?: string): any {
    // NOTHING
  }

  registerParserMiddleware(prefix?: string, rawBody?: boolean): any {
    // NOTHING
  }

  applyVersionFilter(
    // eslint-disable-next-line @typescript-eslint/ban-types
    handler: Function,
    version: any,
    versioningOptions: any,
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): (req: any, res: any, next: () => void) => Function {
    throw new NotImplementException('applyVersionFilter is not implemented');
  }

  createMiddlewareFactory(
    requestMethod: RequestMethod,
  ): // eslint-disable-next-line @typescript-eslint/ban-types
  | ((path: string, callback: Function) => any)
    // eslint-disable-next-line @typescript-eslint/ban-types
    | Promise<(path: string, callback: Function) => any> {
    throw new NotImplementException(
      'createMiddlewareFactory is not implemented',
    );
  }

  render(response: any, view: string, options: any): any {
    throw new NotImplementException('render is not implemented');
  }

  enableCors(options: any, prefix?: string): any {
    throw new NotImplementException('enableCors is not implemented');
  }

  useStaticAssets(...args): any {
    throw new NotImplementException('useStaticAssets is not implemented');
  }

  setViewEngine(engine: string): any {
    throw new NotImplementException('setViewEngine is not implemented');
  }

  private trackOpenConnections() {
    this.httpServer.on('connection', (socket: Duplex) => {
      this.openConnections.add(socket);

      socket.on('close', () => this.openConnections.delete(socket));
    });
  }
}
