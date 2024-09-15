import { Module, Global } from '@nestjs/common';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = createClient({ url: 'redis://localhost:6379' });
        await client.connect();
        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}



