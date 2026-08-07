import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getReqMainInfo } from '@/utils/logger-utils';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    this.logger.info('httpRequest', {
      req: getReqMainInfo(req),
    });
    next();
  }
}
