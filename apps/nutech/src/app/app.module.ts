import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ImageKitMiddleware } from '../middleware/imagekit';

import {
  UserModule
} from '../users/users.module';
import {
  AuthModule
} from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';

import multer from 'multer';
import { ProductsController } from '../products/products.controller';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const isProduction = process.env.NODE_ENV === 'production'
@Module({
  imports: [MongooseModule.forRoot(isProduction?process.env.MONGODB_URL: process.env.MONGODB_URL_DEV),
    UserModule,
    AuthModule,
   ProductsModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(upload.single('image'), ImageKitMiddleware)
      .exclude( 
        { path: 'products', method: RequestMethod.GET },
        'products/(.*)'
      )
      .forRoutes(ProductsController);
  }
}
