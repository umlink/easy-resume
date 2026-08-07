import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { ApiTags } from '@nestjs/swagger';
import { Api } from '@/decorator/api.decorator';
import { ConfigService } from '@/modules/config/config.service';
import { FastifyRequest } from 'fastify';
import { UploadQiNiuResVo } from '@/modules/upload/vo/upload.vo';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Inject(ConfigService)
  private configService: ConfigService;

  @Post('file')
  @Api({
    summary: '单文件上传',
    reqType: FormData,
    resType: UploadQiNiuResVo,
  })
  async uploadFile(@Req() req: FastifyRequest) {
    const file: any = await req.file();
    const folder = file.fields.folder?.value || 'resume';
    const buffer = await file.toBuffer();
    const fileSize = buffer.length;
    const filename = file.filename;
    const maxSize = Number(this.configService.get('UPLOAD_MAX_SIZE'));

    if (fileSize > 1024 * 1024 * maxSize) {
      throw new BadRequestException(`上传文件太大，最大为${maxSize}M`);
    }
    const res = await this.uploadService
      .uploadToQiNiu(filename, folder, buffer)
      .catch((errMsg) => {
        throw new BadRequestException(errMsg);
      });

    return {
      filename,
      size: fileSize,
      url: `${this.configService.get('UPLOAD_HOST')}/${res.key}`,
      type: res.type,
    };
  }
}
