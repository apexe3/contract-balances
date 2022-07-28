import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import * as moment from 'moment';

@Injectable()
export class AppService {
  constructor(@InjectRedis() private redis: Redis) {}
  async getEquityPrices(): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const yFinance = require('yahoo-finance');
    const today = moment().format('YYYY-MM-DD');
    const tradeDaysAgo = 1825;
    const daysAgo = moment()
      .subtract(tradeDaysAgo, 'days')
      .format('YYYY-MM-DD');

    const quotes = await yFinance.quote({
      symbols:
        process.env.EQ_SYMBOLS && process.env.EQ_SYMBOLS.includes(',')
          ? process.env.EQ_SYMBOLS.split(',').slice(1, 10)
          : [process.env.EQ_SYMBOLS],
    });
    const historicalResult = await yFinance.historical({
      symbols:
        process.env.EQ_SYMBOLS && process.env.EQ_SYMBOLS.includes(',')
          ? process.env.EQ_SYMBOLS.split(',').slice(1, 10)
          : [process.env.EQ_SYMBOLS], // query
      from: daysAgo,
      to: today,
    });

    const allHistoricalResult = {};
    Object.values(historicalResult)?.forEach((history: any, index: any) => {
      allHistoricalResult[Object.keys(historicalResult)[index]] = history.map(
        (i: any) => {
          this.redis.sadd(
            `HistoricalYahooData:${quotes[i.symbol].price.exchange}_${
              quotes[i.symbol].price.symbol
            }_${quotes[i.symbol].price.currency}_spot_tick_historical`,
            JSON.stringify({
              open: i.open,
              close: i.close,
              high: i.high,
              low: i.low,
              volume: i.volume,
              venue: quotes[i.symbol].price.exchange,
              venueName: quotes[i.symbol].price.exchangeName,
              base: quotes[i.symbol].price.symbol,
              quote: quotes[i.symbol].price.currency,
            }),
          );
          return {
            open: i.open,
            close: i.close,
            high: i.high,
            low: i.low,
            volume: i.volume,
            venue: quotes[i.symbol].price.exchange,
            venueName: quotes[i.symbol].price.exchangeName,
            base: quotes[i.symbol].price.symbol,
            quote: quotes[i.symbol].price.currency,
          };
        },
      );
    });

    return allHistoricalResult;
  }
}
