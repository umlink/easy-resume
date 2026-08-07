import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ResumeGroupService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  update(id: number, data: Prisma.ResumeGroupUpdateInput) {
    return this.prisma.resumeGroup.update({
      where: { id },
      data,
    });
  }

  findAll() {
    return this.prisma.resumeGroup.findMany({
      select: {
        id: true,
        name: true,
        key: true,
        icon: true,
        types: true,
        sort: true,
      },
    });
  }
}
