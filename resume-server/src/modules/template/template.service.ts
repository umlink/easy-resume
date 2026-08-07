import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { TemplateQueryDto } from '@/modules/template/dto/query-template.dto';
import { Prisma } from '@prisma/client';
import { CreateTemplateDto } from '@/modules/template/dto/create-template.dto';
import { genSnowUUId } from '@/utils/id.gen';
import { UpdateTemplateDto } from '@/modules/template/dto/update-template.dto';

@Injectable()
export class TemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: TemplateQueryDto) {
    const where: Prisma.TemplateWhereInput = {};
    if (query.tags && query.tags.length) {
      where.tags = { array_contains: query.tags };
    }
    if (query.code) {
      where.code = { contains: query.code };
    }
    let orderBy: Prisma.TemplateOrderByWithAggregationInput = {};
    if (query.filter === 'hot') {
      orderBy = { useCount: 'desc' };
    } else if (query.filter == 'new') {
      orderBy = { id: 'desc' };
    }
    return await Promise.all([
      this.prisma.template.findMany({
        skip: (query.pageNum - 1) * query.pageSize,
        take: query.pageSize,
        orderBy,
        where,
      }),
      this.prisma.template.count({ where }),
    ]).then((list) => {
      return {
        list: list[0],
        total: list[1],
        pageNum: query.pageNum,
        pageSize: query.pageSize,
      };
    });
  }

  findTags = () => {
    return this.prisma.template.findMany({
      select: {
        tags: true,
      },
    });
  };

  findOne(code: string) {
    return this.prisma.template.findFirst({ where: { code } });
  }

  update(code: string, data: UpdateTemplateDto) {
    return this.prisma.template.update({
      where: { code },
      data,
    });
  }

  create(data: CreateTemplateDto, userId: number) {
    return this.prisma.template.create({
      data: {
        ...data,
        id: genSnowUUId(),
        tags: [],
        creatorId: userId,
      },
    });
  }

  updateUseCount(code: string) {
    return this.prisma.template.update({
      where: { code },
      data: {
        useCount: {
          increment: 1,
        },
      },
    });
  }

  async getUseCountSum() {
    const result = await this.prisma.template.aggregate({
      _sum: {
        useCount: true,
      },
    });
    return result._sum.useCount ?? 0;
  }

  refreshFindAll() {
    return this.prisma.template.findMany();
  }

  refreshUpdate(data: Prisma.TemplateUpdateInput) {
    return this.prisma.template.update({
      data,
      where: { id: Number(data.id) },
    });
  }
}
