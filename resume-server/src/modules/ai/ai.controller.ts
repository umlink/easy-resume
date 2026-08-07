import { ApiTags } from '@nestjs/swagger';
import pdfParse from 'pdf-parse';
import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  Query,
  Req,
  Res,
  Sse,
} from '@nestjs/common';
import { ResumeService } from '@/modules/resume/resume.service';
import { Observable } from 'rxjs';
import { User } from '@/decorator/user.decorators';
import { AuthUser } from '@/decorator/interface';
import { FastifyReply, FastifyRequest } from 'fastify';
import { DeepSeekService } from './deepseek.service';
import { Api } from '@/decorator/api.decorator';
import { NewSseTaskReq, OptModuleReqDto } from '@/modules/ai/dto/opt.dto';
import { AiService } from '@/modules/ai/ai.service';
import { genSnowUUId } from '@/utils/id.gen';
import { VipService } from '@/modules/vip/vip.service';
import { RESUME_NULL_TEMPLATE } from '@/constants/template';
import { ConfigService } from '@/modules/config/config.service';

@ApiTags('Ai')
@Controller('ai')
export class AIController {
  @Inject(DeepSeekService)
  private deepSeekService: DeepSeekService;
  @Inject(ResumeService)
  private resumeService: ResumeService;
  @Inject(AiService)
  private aiService: AiService;
  @Inject(VipService)
  private vipService: VipService;
  @Inject(ConfigService)
  private configService: ConfigService;

  @Post('/task/add')
  @Api({ summary: '新建一个 sse 任务', reqType: NewSseTaskReq })
  async newSSETask(@Body() data: NewSseTaskReq, @User() user: AuthUser) {
    const res = await this.aiService.addTask({
      id: genSnowUUId(),
      userId: user.id,
      content: data.content,
    });
    return res?.id;
  }

  @Post('/optimize/module-opt')
  @Api({ summary: '简历模块优化', reqType: OptModuleReqDto })
  async resumeModuleOpt(@Body() data: OptModuleReqDto) {
    const abortController = new AbortController(); // 控制流的终止
    const signal = abortController.signal;
    let tips = `根据给出的简历内容进行错别字修改、内容丰富化处理和内容美化处理，请直接给出优化后的结果，待优化内容如下：${data.content}`;
    if (data.description) {
      tips = `根据提供的概要信息写出一份简历中的${data.title}，内容尽量丰富，请直接给出优化后的富文本内容，概要内容如下：${data.description}`;
    }
    const res = await this.deepSeekService.optChat(tips, signal);
    return res?.choices?.[0]?.message?.content;
  }

  @Post('parse/file')
  @Api({
    summary: '解析文件内容，生成简历',
    reqType: FormData,
  })
  async uploadFile(@Req() req: FastifyRequest) {
    const file: any = await req.file();
    const buffer = await file.toBuffer();
    const abortController = new AbortController(); // 控制流的终止
    const signal = abortController.signal;
    let tips = `请根据我给出的简历文本信息，自动组装出一个 json 格式的简历信息，
    json 模板是${JSON.stringify(RESUME_NULL_TEMPLATE)}，其中生成的所有id不可能重复，
    这个 json格式中所有属性不能删除，根据 json 中属性和值的说明信息，请智能分析传入的文本内容，自动解析到这个模板中，
    最后只需输出组装后的模板字符串，注意不太要用\`\`\`json开头，具体内容如下：`;
    await pdfParse(buffer).then((res: any) => {
      tips += res.text;
    });
    const res = await this.deepSeekService.optChat(tips, signal);
    return JSON.parse(res?.choices?.[0]?.message?.content);
  }

  @Sse('/optimize/inspect')
  @Api({ summary: '简历全文优化，输出 stream' })
  async resumeInspectStreamAi(
    @Query('resumeId') id: number,
    @User() user: AuthUser,
    @Res() Response: FastifyReply,
  ): Promise<Observable<any>> {
    const data = await this.resumeService.findOne({
      id: Number(id),
      userId: user.id,
    });
    if (!data) {
      throw new BadRequestException('简历不存在');
    }
    const abortController = new AbortController(); // 控制流的终止
    return new Observable((observer) => {
      const signal = abortController.signal;
      this.deepSeekService
        .streamChat(
          `给你一份json字符串格式的简历信息，请根据 json 字符串识别错别字和提出优化建议，注意只需要关注简历内容，格式和字段值无需关心，请直接给出优化内容，无需开头说明信息，json如下：${JSON.stringify(data.content)}`,
          signal,
        )
        .then(async (stream: any) => {
          if (this.configService.get('AI_CHECK_COUNT_ENABLED') === 'True') {
            await this.vipService.subCheckCount(user.id).catch(() => {
              observer.next('done-检测次数不足，可通过续费会员继续使用');
              observer.complete();
              abortController.abort();
            });
          }
          for await (const chunk of stream) {
            const delta = chunk.choices[0].delta;
            if (chunk.choices[0].finish_reason === 'stop') {
              console.log(chunk.choices[0].usage);
              observer.next('done');
              observer.complete();
            }
            if (delta.content) {
              observer.next(delta.content);
            }
          }
        })
        .catch((e) => {
          observer.complete();
          abortController.abort();
          throw new BadGatewayException(e);
        });

      const closeHandler = () => {
        console.log('客户端已断开连接（页面刷新或关闭）');
        observer.complete();
        abortController.abort();
      };

      Response.raw.on('close', closeHandler);
      return () => {
        Response.raw.off('close', closeHandler);
      };
    });
  }

  @Sse('/resume/chat')
  @Api({ summary: '简历小 K 智能 ai，根据任务 id执行任务' })
  async resumeAiChatStream(
    @Query('taskId') taskId: number,
    @User() user: AuthUser,
    @Res() Response: FastifyReply,
  ): Promise<Observable<any>> {
    const data = await this.aiService.findOne({
      id: taskId,
      userId: user.id,
    });
    if (!data) {
      throw new BadRequestException('任务不存在');
    }
    // 删除任务记录（无用）
    this.aiService.removeTask(taskId);
    const abortController = new AbortController();
    return new Observable((observer) => {
      const signal = abortController.signal;
      this.deepSeekService
        .streamChat(data.content, signal)
        .then(async (stream: any) => {
          if (this.configService.get('AI_TOKENS_ENABLED') === 'True') {
            await this.vipService
              .subTokens(data.content.length, user.id)
              .catch(() => {
                observer.next('done-tokens 数不足，可通过会员续费继续使用');
                observer.complete();
                abortController.abort();
              });
          }
          for await (const chunk of stream) {
            const delta = chunk.choices[0].delta;
            if (chunk.choices[0].finish_reason === 'stop') {
              observer.next('done');
              observer.complete();
            }
            if (delta.content) {
              observer.next(delta.content);
            }
          }
        })
        .catch((e) => {
          console.log(e);
          observer.next('done-tokens 内容太长，检测到非法请求');
          observer.complete();
          abortController.abort();
        });

      const closeHandler = () => {
        console.log('客户端已断开连接（页面刷新或关闭）');
        observer.complete();
        abortController.abort();
      };

      Response.raw.on('close', closeHandler);
      return () => {
        Response.raw.off('close', closeHandler);
      };
    });
  }
}
