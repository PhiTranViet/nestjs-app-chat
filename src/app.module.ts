import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { PostModule } from './module/post/post.module';
import { ChatModule } from './module/chat/chat.module';
import { NotificationModule } from './module/notification/notification.module';
import { GroupGateway } from './module/group/group.gateway';
import { GroupModule } from './module/group/group.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, 
    }), AuthModule, PostModule, UserModule, ChatModule, NotificationModule, GroupModule,
  ],
  providers: [GroupGateway],
})
export class AppModule {}