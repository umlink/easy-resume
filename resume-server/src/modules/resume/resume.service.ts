import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { MigrationResumeDto, UpdateResumeDto } from './dto/update-resume.dto';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { genSnowUUId } from '@/utils/id.gen';
import { Prisma } from '@prisma/client';
import { UsersService } from '@/modules/users/users.service';
import { AuthUser } from '@/decorator/interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@/modules/config/config.service';

@Injectable()
export class ResumeService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(UsersService)
  private userServer: UsersService;

  @Inject(ConfigService)
  private configService: ConfigService;

  create(createResumeDto: CreateResumeDto, userId: number) {
    return this.prisma.resume.create({
      data: {
        id: genSnowUUId(),
        userId,
        ...createResumeDto,
      },
      select: { id: true },
    });
  }

  async findAll(query: { userId?: number; pageSize: number; pageNum: number }) {
    const where = { userId: query.userId, deleted: 0 };
    return await Promise.all([
      this.prisma.resume.findMany({
        skip: (query.pageNum - 1) * query.pageSize,
        take: query.pageSize,
        where,
        orderBy: {
          updatedAt: 'desc',
        },
        select: {
          id: true,
          accessCode: true,
          dataTmp: true,
          title: true,
          templateCode: true,
          updatedAt: true,
          content: true,
          createdAt: true,
        },
      }),
      this.prisma.resume.count({ where }),
    ]).then((list) => {
      return {
        list: list[0],
        total: list[1],
        pageNum: query.pageNum,
        pageSize: query.pageSize,
      };
    });
  }

  findOne(where: Prisma.resumeWhereInput) {
    return this.prisma.resume.findFirst({
      where: {
        ...where,
        deleted: 0,
      },
    });
  }

  update(userId: number, updateResumeDto: UpdateResumeDto) {
    return this.prisma.resume.update({
      data: updateResumeDto,
      where: {
        id: updateResumeDto.id,
        userId,
      },
    });
  }

  incrementExportCount(id: number) {
    return this.prisma.resume.update({
      where: {
        id,
      },
      data: {
        exportCount: {
          increment: 1,
        },
      },
    });
  }

  getCountByUserId(userId: number) {
    return this.prisma.resume.count({ where: { userId, deleted: 0 } });
  }

  getCountAll() {
    return this.prisma.resume.count();
  }

  remove(id: number, userId: number) {
    return this.prisma.resume.update({
      where: {
        id,
        userId,
      },
      data: { deleted: 1 },
    });
  }

  updateAll(data: any) {
    return this.prisma.resume.update({
      data,
      where: {
        id: data.id,
      },
    });
  }

  findAllData() {
    return this.prisma.resume.findMany();
  }

  tempUpdate(updateResumeDto: UpdateResumeDto) {
    return this.prisma.resume.update({
      data: updateResumeDto,
      where: {
        id: updateResumeDto.id,
      },
    });
  }

  updateUserId(fromId: number, toId: number) {
    return this.prisma.resume.update({
      data: { userId: toId },
      where: {
        id: fromId,
      },
    });
  }

  async syncDataForUpdate(user: AuthUser, data: MigrationResumeDto) {
    // 当前的微信小程序用户 id
    const toUser = await this.userServer.getPrivateUserById(user.id);
    if (toUser.email) {
      throw new BadRequestException('数据已迁移完毕');
    }
    // 获取邮箱登录的账号
    const fromUser = await this.userServer.getUserByEmail({
      email: data.email,
    });
    return this.prisma.$transaction(async (prisma) => {
      // 将旧数据同步到最新的账户下
      const avatar = fromUser.avatar || this.configService.get('DEFAULT_USER_AVATAR');

      await prisma.user.update({
        where: { id: toUser.id },
        data: {
          username: fromUser.username,
          avatar,
          email: fromUser.email,
          roles: fromUser.roles,
        },
      });
      await prisma.resume.updateMany({
        where: {
          userId: fromUser.id,
        },
        data: { userId: toUser.id },
      });
      // 删除无用用户
      await prisma.user.update({
        where: { id: fromUser.id },
        data: { disabled: 1 },
      });
      // 数据迁移成功后返回一个新的 token
      return this.jwtService.sign({
        id: toUser.id,
        username: fromUser.username,
        avatar: fromUser.avatar,
        email: fromUser.email,
        roles: fromUser.roles,
      });
    });
  }
}
