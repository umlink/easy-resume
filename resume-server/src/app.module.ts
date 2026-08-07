import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from './modules/config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import providers from '@/providers';
import { ConfigService } from '@/modules/config/config.service';
import {
  consoleLogOption,
  getLogTransportByLevel,
  throttleOptions,
} from '@/utils/modules-utils';
import { WinstonModule } from 'nest-winston';
import { RolesModule } from '@/modules/roles/roles.module';
import { ResumeModule } from './modules/resume/resume.module';
import { TemplateModule } from './modules/template/template.module';
import { VipTypeModule } from './modules/vip-type/vip-type.module';
import { VipModule } from './modules/vip/vip.module';
import { EmailModule } from '@/modules/email/email.module';
import Transport from 'winston-transport';
import { UploadModule } from '@/modules/upload/upload.module';
import { PuppeteerModule } from '@/modules/puppeteer/puppeteer.module';
import { ProposeModule } from '@/modules/propose/propose.module';
import { GuideModule } from '@/modules/guide/guide.module';
import { ResumeGroupModule } from '@/modules/resume-group/group.module';
import winston from 'winston';
import { HttpModule } from '@nestjs/axios';
import { OrderModule } from './modules/order/order.module';
import { AiModule } from '@/modules/ai/ai.module';
import { InviteModule } from '@/modules/invite/invite.module';

@Module({
  imports: [
    ConfigModule.register({ folder: '' }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          ttl: 1000 * Number(configService.get('CACHE_HTTP_GLOBAL_TTL')),
          max: 1000 * Number(configService.get('CACHE_HTTP_GLOBAL_MAX')),
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          throttlers: throttleOptions(configService),
        };
      },
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const transports: Transport[] = [
          getLogTransportByLevel(configService),
          getLogTransportByLevel(configService, 'error'),
        ];
        if (process.env.NODE_ENV === 'development') {
          transports.push(new winston.transports.Console(consoleLogOption));
        }
        return {
          transports,
        };
      },
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    ResumeModule,
    TemplateModule,
    VipTypeModule,
    VipModule,
    EmailModule,
    UploadModule,
    PuppeteerModule,
    ProposeModule,
    GuideModule,
    ResumeGroupModule,
    HttpModule,
    OrderModule,
    AiModule,
    InviteModule,
  ],
  providers,
})
// 设置中间件，可指定路由可方法, 这种方式可以注入 service，函数式中间行无法注入 service.
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
