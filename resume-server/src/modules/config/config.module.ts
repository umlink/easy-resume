import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CONFIG_OPTIONS } from '@/constants/dynamic-module';

/**
 * 关于使用 register、forRoot、forFeature 的区别介绍
 * register: 每个模块可单独设置参数
 * forRoot: 注册一次，单实例使用
 * forFeature: 单例可修改
 * 还有： registerAsync、forRootAsync 和 forFeatureAsync
 * https://nestjs.inode.club/fundamentals/dynamic-modules#%E7%A4%BE%E5%8C%BA%E6%8C%87%E5%8D%97
 * */

@Global() // 全局可用
@Module({})
export class ConfigModule {
  static register(options: Record<string, any>): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
