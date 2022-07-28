import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('yahoo')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/history')
  getEquityPrices() {
    return this.appService.getEquityPrices();
  }
}
