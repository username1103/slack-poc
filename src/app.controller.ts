import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  async getHello(): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return '123';
  }
}
