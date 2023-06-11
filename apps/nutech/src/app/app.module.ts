import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';

import {
  UserModule
} from '../users/users.module';
import {
  AuthModule
} from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URL),
   ProductsModule
  ]
})
export class AppModule {}
