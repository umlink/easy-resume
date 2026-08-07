import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AiService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  addTask(data: Prisma.aiTaskCreateInput) {
    return this.prisma.aiTask.create({ data });
  }

  findOne(where: Prisma.aiTaskWhereInput) {
    return this.prisma.aiTask.findFirst({ where });
  }

  removeTask(taskId: number) {
    this.prisma.aiTask.delete({ where: { id: taskId } });
  }
}
