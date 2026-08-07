import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@/modules/config/config.service';
import dayjs from 'dayjs';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    //输出查询SQL等LOG
    super({
      log: (configService.get('DATABASE_LOG_LEVEL') || 'info').split(
        ',',
      ) as any,
      datasourceUrl: configService.get('DATABASE_URL'),
      transactionOptions: {},
    });
    // 利用中间件对查询数据库的结果Bigint类型进行序列化！
    super.$use(async (params, next) => {
      // 更新操作统一添加
      if (params.action === 'update') {
        params.args.data.updatedAt = dayjs().toDate();
      }
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      Logger.log(
        `Prisma Hooks: ${params.model}.${params.action} took ${after - before}ms`,
      );
      return this.bigIntSerialize(result);
    });
  }

  bigIntSerialize(obj: any) {
    if (typeof obj !== 'bigint') {
      if (typeof obj === 'object' && obj !== null) {
        return JSON.parse(
          JSON.stringify(obj, (key, value) => {
            if (typeof value === 'bigint') {
              return value.toString();
            }
            return value;
          }),
        );
      }
    } else {
      return obj.toString();
    }
    return obj;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
