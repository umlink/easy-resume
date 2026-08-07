import { Injectable } from '@nestjs/common';
import { CreateVipTypeDto } from './dto/create-vip-type.dto';
import { UpdateVipTypeDto } from './dto/update-vip-type.dto';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { vip_type_sell_type } from '@prisma/client';

@Injectable()
export class VipTypeService {
  constructor(private readonly prisma: PrismaService) {}

  create(createVipTypeDto: CreateVipTypeDto) {
    return this.prisma.vipType.create({ data: createVipTypeDto });
  }

  findByType(type: vip_type_sell_type) {
    return this.prisma.vipType.findFirst({
      where: {
        sellType: type,
      },
    });
  }

  findById(id: number | bigint) {
    return this.prisma.vipType.findFirst({
      where: { id },
    });
  }

  findAll() {
    return this.prisma.vipType.findMany({
      where: {
        sellType: vip_type_sell_type.SELL,
        disabled: 0,
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        optTokens: true,
        checkCount: true,
        originalPrice: true,
        equity: true,
        duration: true,
      },
    });
  }

  update(id: number, updateVipTypeDto: UpdateVipTypeDto) {
    return this.prisma.vipType.update({
      where: { id },
      data: updateVipTypeDto,
    });
  }
}
