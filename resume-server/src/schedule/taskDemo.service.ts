import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import dayjs from 'dayjs';
import { ConfigService } from '@/modules/config/config.service';

@Injectable()
export class TaskDemoService {
  private readonly logger = new Logger(TaskDemoService.name);

  constructor(private readonly configService: ConfigService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  handleCron() {
    Logger.log('这是一个定时任务，每天凌晨一点执行 sql 备份任务');
    // this.backupDatabase();
  }
  async backupDatabase() {
    const dbUrl = new URL(this.configService.get('DATABASE_URL'));
    const userName = decodeURIComponent(dbUrl.username);
    const password = decodeURIComponent(dbUrl.password);
    const dbName = dbUrl.pathname.slice(1);
    const dateTime = dayjs().format('YYYY-MM-DD');
    const backupCommand = `mysqldump -u ${userName} -p${password} ${dbName} > /root/sql-backup/${dbName}_backup_${dateTime}.sql`;
    return new Promise((resolve, reject) => {
      exec(backupCommand, (error, stdout) => {
        this.logger.error(error);
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}
