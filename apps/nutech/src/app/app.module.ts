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

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URL),
    UserModule,
    AuthModule,
   ProductsModule
  ]
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(upload.single('image'), ImageKitMiddleware)
      .exclude(
        { path: 'api/products', method: RequestMethod.GET },
        'api/products/(.*)'
      )
      .forRoutes('products');
  }
}
