import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Inject, Injectable } from '@nestjs/common';
import { EnvConfig } from './interfaces';
import { CONFIG_OPTIONS } from '@/constants/dynamic-module';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(
    @Inject(CONFIG_OPTIONS) private options: Partial<{ folder: string }>,
  ) {
    const filePath = `.env.${process.env.NODE_ENV || 'development'}`;
    const envFile = path.resolve(process.cwd(), options.folder, filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: keyof EnvConfig): string {
    return this.envConfig[key];
  }

  getAll() {
    return this.envConfig;
  }
}
