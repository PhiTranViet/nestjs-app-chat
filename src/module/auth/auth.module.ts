import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { PostService } from '../post/post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User,Post } from '../../database/entities';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Post]),
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true, // Make the config globally available
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule here
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRED') || '24h',
        },
      }),
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, UserService,PostService],
  controllers: [AuthController],
  exports: [AuthService, UserService,JwtModule],
})
export class AuthModule {}