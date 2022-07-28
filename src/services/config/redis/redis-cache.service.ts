import * as redisStore from 'cache-manager-redis-store';
import { Cache } from 'cache-manager';
import { from, Observable } from 'rxjs';

import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';

import { AppConfigService, MODE } from '../config.service';

@Injectable()
export class RedisCacheService {
  private redisPrefix = 'E3';
  public allowPrefix = true;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private config: AppConfigService,
  ) {}

  public isProduction(): boolean {
    return this.config.getAppMode() === MODE.PRODUCTION;
  }

  public createRedisConnectOptions(): any {
    const { host, port } = this.config.getRedisConfig();
    return {
      store: redisStore,
      host,
      port,
    };
  }

  setPrefix(key: any): any {
    return this.allowPrefix ? `${this.redisPrefix}:${key}` : key;
  }

  get(key: string): Observable<any> {
    return from(this.cache.get(this.setPrefix(key)));
  }

  set(key: string, value: any, options: any) {
    from(this.cache.set(this.setPrefix(key), JSON.stringify(value), options));
  }

  del(key: any) {
    from(this.cache.del(this.setPrefix(key)));
  }
}
