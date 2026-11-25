import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { JwtAuthGuard } from './strategies/guards/jwt-auth.guard.js';
@Module({
  imports: [
    UsersModule, 
    PassportModule, 
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtModule, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
