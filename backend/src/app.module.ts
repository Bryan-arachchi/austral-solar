import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ulid } from 'ulid';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ClsModule } from 'nestjs-cls';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import mongoose from 'mongoose';
import { Logger } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { S3Module } from './s3/s3.module';
import { PayhereModule } from './payhere/payhere.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { BranchesModule } from './branches/branches.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

mongoose.set('debug', (collectionName, methodName, ...methodArgs) => {
  Logger.verbose(`${collectionName}.${methodName}(${JSON.stringify(methodArgs)})`, 'Mongoose');
});

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        NO_COLOR: Joi.boolean().optional().default(true),
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
        //brevo
        BREVO_SMTP: Joi.string().required(),
        BREVO_USER: Joi.string().required(),
        BREVO_PASS: Joi.string().required(),
        BREVO_SMTP_PORT: Joi.string().required(),
        EMAIL_FROM_ADDRESS: Joi.string().required(),
        //aws
        AWS_REGION: Joi.string().required(),
        AWS_BUCKET_NAME: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),

        //payhere
        MERCHANT_ID: Joi.string().required(),
        MERCHANT_SECRET: Joi.string().required(),
        BACKEND_URL: Joi.string().required(),

        //auth0
        AUTH0_DOMAIN: Joi.string().required(),
        AUTH0_CLIENT_ID: Joi.string().required(),
        AUTH0_CLIENT_SECRET: Joi.string().required(),
        AUTH0_CALLBACK_URL: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI as string,
      {
        autoIndex: true,
        autoCreate: true,
      } as MongooseModuleOptions,
    ),

    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup: (cls, req, res) => {
          const requestId = ulid();
          cls.set('x-request-id', requestId);
          res.setHeader('X-Request-ID', requestId);
        },
      },
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    EmailModule,

    S3Module,

    PayhereModule,

    UsersModule,

    ProductsModule,

    BranchesModule,

    AuthModule,

    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
