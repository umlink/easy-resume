import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NotLogin } from '@/decorator/auth.decorators';
import { RequiredRoles } from '@/decorator/roles.decorator';
import { RolesEnums } from '@/constants/enums';

type CacheTypeDemo = {
  name: string;
  description: string;
};

@Controller('test')
export class TestController {
  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('/config')
  getConfig(): string {
    return this.configService.get('NODE_ENV');
  }
  @Get('/addCache')
  @NotLogin()
  async addCache() {
    await this.cacheManager.set('cache-key', {
      name: 'cache',
      description: '这是缓存测试数据',
    });
    return '缓存设置成功';
  }
  @Get('/getCache')
  @NotLogin()
  async getCache(): Promise<CacheTypeDemo> {
    return await this.cacheManager.get<CacheTypeDemo>('cache-key');
  }
  @Get('/admin')
  @RequiredRoles(RolesEnums.Admin, RolesEnums.SuperAdmin) // 只有管理员和超管可以访问
  getTest2(): string {
    return this.configService.get('NODE_ENV');
  }
}
