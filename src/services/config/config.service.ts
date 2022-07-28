import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

export interface IEnvironment extends NodeJS.ProcessEnv {
  PORT: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_DB: string;
  REDIS_PASSWORD: string;
  REDIS_PREFIX: string;
}

const env: IEnvironment = process.env as IEnvironment;

export enum MODE {
  DEV = 'DEV',
  PRODUCTION = 'PRODUCTION',
}

export interface IRedisConfig {
  host: string;
  port: string;
  db: string;
  password: string;
  keyPrefix: string;
}
export interface IConfig {
  port: number;
  redis: IRedisConfig;
}

export enum ConfigKeys {
  PORT = 'port',
  REDIS = 'redis',
  MODE = 'mode',
}

export const configuration = (): IConfig => ({
  port: Number(env.PORT) || 3000,
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    db: env.REDIS_DB,
    password: env.REDIS_PASSWORD,
    keyPrefix: env.REDIS_PREFIX,
  },
});

@Injectable()
export class AppConfigService {
  constructor(private config: ConfigService) {}

  getPort(): number {
    return this.config.get<number>(ConfigKeys.PORT);
  }
  getRedisConfig(): IRedisConfig {
    return this.config.get<IRedisConfig>(ConfigKeys.REDIS);
  }
  getAppMode(): MODE {
    return this.config.get<MODE>(ConfigKeys.MODE);
  }
}
