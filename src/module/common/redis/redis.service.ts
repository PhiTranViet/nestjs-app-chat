import { Injectable,Inject } from '@nestjs/common';
import { Redis } from 'ioredis'; 

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async setToken(userId: number, token: string, ttl: number) {
    await this.redis.set(`jwt_${userId}`, token, 'EX', ttl);
  }

  async getToken(userId: number): Promise<string | null> {
    return await this.redis.get(`jwt_${userId}`);
  }

  async deleteToken(userId: number) {
    await this.redis.del(`jwt_${userId}`);
  }

  async set(key: string, value: string) {
    await this.redis.set(key, value);
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async del(key: string) {
    await this.redis.del(key);
  }
}