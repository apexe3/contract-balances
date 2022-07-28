import * as redisStore from 'cache-manager-redis-store';

import { CacheModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfigService } from '../config.service';
import { RedisCacheService } from './redis-cache.service';

@Module({
  providers: [RedisCacheService, AppConfigService],
  exports: [RedisCacheService],
  imports: [
    CacheModule.registerAsync({
      imports: [RedisCacheModule],
      extraProviders: [AppConfigService],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        const { host, port } = configService.getRedisConfig();
        return {
          store: redisStore,
          host,
          port,
        };
      },
    }),
  ],
})
export class RedisCacheModule {}
