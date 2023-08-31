import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class RedisCacheService {
  constructor(private readonly redisService: RedisService) {}

  async get(key: string): Promise<any> {
    const client = this.redisService.getClient();
    const value = await client.get(key);
    return JSON.parse(value);
  }

  async set(
    key: string,
    value: any,
    ttl: number = 6000000000000,
  ): Promise<void> {
    const client = this.redisService.getClient();
    await client.set(key, JSON.stringify(value), 'EX', ttl);
  }
}
