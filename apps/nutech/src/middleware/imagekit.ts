/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
import FormData = require('form-data');
import axios from 'axios';

interface MulterRequest extends Request {
  file: any;
}

@Injectable()
export class ImageKitMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!(req as MulterRequest).file) {
      next({ name: 'File required' });
    } else {
      console.log('masuk');

      const form = new FormData();
      const date = new Date().toLocaleDateString();

      form.append(
        'file',
        (req as MulterRequest).file.buffer.toString('base64')
      );
      form.append('fileName', `${req.body.productname}-${date}`);

      const bufferFrom = `${process.env.PRIVATE_KEY_IMAGEKIT}:`;

      const privateKey = Buffer.from(bufferFrom).toString('base64');

      axios
        .post('https://api.imagekit.io/v1/files/upload', form, {
          headers: {
            ...form.getHeaders(),
            Authorization: `Basic ${privateKey}`,
          },
        })
        .then(function (response) {
          req.body.image = response.data.url;
          console.log(response.data.url);

          next();
        })
        .catch(function (error) {
          next(error);
        });
    }
  }
}