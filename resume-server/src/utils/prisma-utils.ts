import { Prisma } from '@prisma/client';
import { PrismaEnum } from '@/constants/enums';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

export function pageCursorUtils<T>(q: {
  take: number;
  key: string;
  cursor?: number;
}): T {
  const params: any = {
    take: q.take,
    skip: q.cursor ? 1 : 0,
  };
  if (q.cursor) {
    params.cursor = {
      [q.key]: q.cursor,
    };
  }
  return params;
}

export const errorHandler = (err: Prisma.PrismaClientKnownRequestError) => {
  if (err.code === PrismaEnum.NoData) {
    throw new HttpException('未找到该数据', HttpStatus.BAD_REQUEST);
  }
  if (err.code === PrismaEnum.TooLong) {
    throw new HttpException(
      `数据字段【${err.meta.column_name}】长度不合法`,
      HttpStatus.BAD_REQUEST,
    );
  }
  if (err.code === PrismaEnum.Unique) {
    throw new HttpException(
      `数据字段【${err.meta.column_name}】重复`,
      HttpStatus.BAD_REQUEST,
    );
  }
  throw new InternalServerErrorException('未知异常');
};
