import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';

export class PaginationDto<T> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  pageNum: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty({ type: () => [Object] })
  list: T[];
}
export class ResponseObjDto<T = any> {
  @ApiProperty()
  code: number;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: () => Object })
  data: T;
}

export class ResponseListDto<T = any> {
  @ApiProperty()
  code: number;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: () => [Object], isArray: true })
  data: PaginationDto<T>;
}

export function ApiDataResponse<T>(entity: Type<T>) {
  return applyDecorators(
    ApiExtraModels(ResponseObjDto, ResponseListDto, PaginationDto, entity),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseObjDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(entity) },
            },
          },
        ],
      },
    }),
  );
}
