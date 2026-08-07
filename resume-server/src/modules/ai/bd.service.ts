import { ChatCompletion, setEnvVariable } from '@baiducloud/qianfan';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@/modules/config/config.service';

@Injectable()
export class BaiduAiService {
  constructor(@Inject(ConfigService) config: ConfigService) {
    setEnvVariable('QIANFAN_ACCESS_KEY', config.get('AI_BAIDU_ACCESS_KEY'));
    setEnvVariable('QIANFAN_SECRET_KEY', config.get('AI_BAIDU_SECRET_KEY'));
  }
  async chat(contentString: string) {
    const client = new ChatCompletion();
    const resp = await client.chat(
      {
        messages: [
          {
            role: 'user',
            content: `请找出下面内容中的中文错别字：${contentString}`,
          },
        ],
      },
      'ERNIE-4.0-8K',
    );
    return resp.result;
  }
}
