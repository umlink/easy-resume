import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

type ApiOptions = {
  summary?: string;
  reqType?: any;
  resType?: any;
  reqIsArray?: boolean;
  resIsArray?: boolean;
};

export const Api = ({
  summary,
  reqType,
  resType,
  reqIsArray = false,
  resIsArray = false,
}: ApiOptions = {}) => {
  const list = [ApiOperation({ summary })];
  if (reqType) {
    list.push(ApiBody({ type: reqType, isArray: reqIsArray }));
  }
  list.push(
    ApiResponse({
      status: 200,
      type: resType ?? String,
      isArray: resIsArray,
    }),
  );

  return applyDecorators(...list);
};
