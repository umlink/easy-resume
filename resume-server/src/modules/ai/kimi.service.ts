import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@/modules/config/config.service';

@Injectable()
export class KimiAiService {
  private openAI;
  constructor(@Inject(ConfigService) config: ConfigService) {
    this.openAI = new OpenAI({
      apiKey: config.get('AI_KIMI_API_KEY'),
      baseURL: config.get('AI_KIMI_BASE_URL'),
    });
  }

  chat(content: string, signal: AbortSignal) {
    const history = [
      {
        role: 'system',
        content:
          '你是小 K，非常擅长简历优化，可以识别简历错别字，关键信息提取和分析，分析后可以给出非常专业的修改建议',
      },
    ];
    history.push({
      role: 'user',
      content: `给你一份json字符串格式的简历信息，
      请根据 json 字符串识别错别字和提出优化建议，
      注意只需要关注简历内容，格式和字段值无需关心，
      请直接给出优化内容，无需开头说明信息，
      关键词请加粗，
      json如下：${content}`,
    });
    return this.openAI.chat.completions.create({
      model: 'moonshot-v1-8k',
      messages: history,
      temperature: 0.1,
      stream: true,
      signal,
    });
  }
}
