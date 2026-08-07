import { Inject, Injectable } from '@nestjs/common';
import { Spark } from 'spark-nodejs';
import { ConfigService } from '@/modules/config/config.service';

@Injectable()
export class XunFeiAiService {
  private spark: Spark;
  constructor(@Inject(ConfigService) config: ConfigService) {
    this.spark = new Spark({
      secret: config.get('AI_XF_API_SECRET'),
      key: config.get('AI_XF_API_KEY'),
      appid: config.get('AI_XF_APP_ID'),
    });
  }
  sparkLiteChat(contentString: string) {
    return this.spark.chat({
      content: `请检查下面内容里面的中文错别字：${contentString}`,
    });
  }
}
