import { InternalServerErrorException } from '@nestjs/common';

export const MONGO_CONFIG = Symbol('MONGO_CONFIG');
export type MongoConfig = {
  host: string;
  port: number;

  database: string;
  user: string;
  pass: string;
};

export const loadMongoConfig = (): {
  [MONGO_CONFIG]: MongoConfig;
} => {
  const { MONGO_HOST, MONGO_PORT, MONGO_DATABASE, MONGO_USER, MONGO_PASS } =
    process.env;

  if (MONGO_HOST === undefined)
    throw new InternalServerErrorException('MONGO_HOST');

  if (MONGO_PORT === undefined)
    throw new InternalServerErrorException('MONGO_PORT');

  if (MONGO_DATABASE === undefined)
    throw new InternalServerErrorException('MONGO_DATABASE');

  if (MONGO_USER === undefined)
    throw new InternalServerErrorException('MONGO_USER');

  if (MONGO_PASS === undefined)
    throw new InternalServerErrorException('MONGO_PASS');

  const port = parseInt(MONGO_PORT, 10);
  if (isNaN(port)) throw new InternalServerErrorException('MONGO_PORT');

  return {
    [MONGO_CONFIG]: {
      host: MONGO_HOST,
      port,
      database: MONGO_DATABASE,
      user: MONGO_USER,
      pass: MONGO_PASS,
    },
  };
};
