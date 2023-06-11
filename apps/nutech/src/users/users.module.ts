import {
  Module
} from '@nestjs/common';
import {
  UserService
} from './user.service';
import {
  UserController
} from './user.controller';
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
  HashService
} from '../users/hash.service';
import {
  AuthService
} from '../auth/auth.service';
import {
  JwtStrategy
} from '../strategy/jwt.strategy';
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
  controllers: [UserController],
  providers: [UserService, HashService, AuthService, JwtStrategy, LocalStrategy],
})
export class UserModule {}