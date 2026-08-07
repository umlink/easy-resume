import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GuideQueryDto } from '@/modules/guide/dto/query-guide.dto';

@Injectable()
export class GuideService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  create(data: Prisma.guideCreateInput) {
    return this.prisma.guide.create({ data });
  }

  delete(id: number) {
    return this.prisma.guide.delete({ where: { id } });
  }

  update(id: number, data: Prisma.guideUpdateInput) {
    return this.prisma.guide.update({ data, where: { id } });
  }

  findOne(where: Prisma.guideWhereInput) {
    return this.prisma.guide.findFirst({
      where,
    });
  }

  async findAll(query: GuideQueryDto, status: number) {
    return await Promise.all([
      this.prisma.guide.findMany({
        skip: (query.pageNum - 1) * query.pageSize,
        take: query.pageSize,
        select: {
          id: true,
          title: true,
        },
        orderBy: { sort: 'asc' },
        where: { status },
      }),
      this.prisma.guide.count({ where: { status } }),
    ]).then((list) => {
      return {
        list: list[0],
        total: list[1],
        pageNum: query.pageNum,
        pageSize: query.pageSize,
      };
    });
  }
}
