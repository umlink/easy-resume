import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@/modules/config/config.service';

@Injectable()
export class DeepSeekService {
  private openAI;

  constructor(@Inject(ConfigService) config: ConfigService) {
    this.openAI = new OpenAI({
      apiKey: config.get('AI_DEEPSEEK_API_KEY'),
      baseURL: config.get('AI_DEEPSEEK_BASE_URL'),
    });
  }

  streamChat(content: string, signal: AbortSignal) {
    const history = [
      {
        role: 'system',
        content:
          '你是小 K，非常擅长简历优化、识别简历错别字、关键信息提取和分析和分析后可以给出非常专业的修改建议',
      },
    ];
    history.push({
      role: 'user',
      content,
    });
    return this.openAI.chat.completions.create({
      model: 'deepseek-v4-flash',
      messages: history,
      stream: true,
      signal,
      reasoning_effort: 'high',
    });
  }

  optChat(content: string, signal: AbortSignal) {
    const history = [
      {
        role: 'system',
        content: '你是小 K，擅长简历优化，可以根据提示信息优化和美化简历',
      },
    ];
    history.push({
      role: 'user',
      content,
    });
    return this.openAI.chat.completions.create({
      model: 'deepseek-chat',
      messages: history,
      temperature: 0.1,
      signal,
    });
  }
}
