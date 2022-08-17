import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getEquityPrices(): Promise<any> {
    return this.appService.getBalances();
  }
}
