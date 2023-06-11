import {
  Module
} from '@nestjs/common';
import {
  AuthService
} from './auth.service';
import {
  AuthController
} from './auth.controller';
import {
  MongooseModule
} from '@nestjs/mongoose';
import {
  User,
  UserSchema
} from '../users/user.schema';
import {
  JwtModule
} from '@nestjs/jwt';
import {
  UserService
} from '../users/user.service';
import {
  HashService
} from '../users/hash.service';
import {
  LocalStrategy
} from '../strategy/local.strategy';

@Module({
  imports: [
   MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
   JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '60d'
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, LocalStrategy, HashService],
})
export class AuthModule {}