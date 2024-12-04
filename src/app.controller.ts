import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  /* eslint-disable no-unused-vars */
  constructor(private readonly appService: AppService) {}
  /* eslint-enable no-unused-vars */

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}