import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProposeService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  create(data: Prisma.proposeCreateInput) {
    return this.prisma.propose.create({ data });
  }
}
