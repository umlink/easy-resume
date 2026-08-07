import { Inject, Injectable } from '@nestjs/common';
import * as qiniu from 'qiniu';
import { ConfigService } from '@/modules/config/config.service';
import { Md5 } from 'ts-md5';

@Injectable()
export class UploadService {
  @Inject(ConfigService)
  private configService: ConfigService;

  async uploadToQiNiu(
    filename: string,
    folder: string,
    buffer: Buffer,
  ): Promise<{
    hash: string;
    key: string;
    type: string;
  }> {
    const config = this.configService;
    const mac = new qiniu.auth.digest.Mac(
      config.get('UPLOAD_QI_NIU_ACCESS_KEY'),
      config.get('UPLOAD_QI_NIU_SECRET_KEY'),
    );
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: config.get('UPLOAD_QI_NIU_BUCKET'),
    });
    const uploadToken = putPolicy.uploadToken(mac);
    const formUploader = new qiniu.form_up.FormUploader();
    const fileSuffix = filename.split('.').pop().toLowerCase();
    const fileKey =
      `${folder}/` +
      Md5.hashStr(`${Date.now()}-${filename}`) +
      `.${fileSuffix}`;
    const PutExtra = new qiniu.form_up.PutExtra();

    return new Promise((resolve, reject) => {
      return formUploader.put(
        uploadToken,
        fileKey,
        buffer,
        PutExtra,
        (respErr, respBody, respInfo) => {
          if (respErr) {
            reject(respErr.message);
          }
          if (respInfo.statusCode == 200) {
            resolve({
              ...respBody,
              type: fileSuffix,
            });
          } else {
            reject(respInfo);
          }
        },
      );
    });
  }
}
