import { InternalServerErrorException, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  loadMongoConfig,
  MongoConfig,
  MONGO_CONFIG,
} from './config/mongo.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(loadMongoConfig)],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<any>) => {
        const mongoConfig = configService.get<MongoConfig>(MONGO_CONFIG);
        if (mongoConfig === undefined)
          throw new InternalServerErrorException('NO_MONGO_CONFIG');
        const { host, port, database, user, pass } = mongoConfig;
        return {
          uri: `mongodb://${host}:${port}/${database}`,
          user,
          pass,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          // useCreateIndex: true,
          // useFindAndModify: false,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
