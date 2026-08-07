import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
/**
 * 这种方法可以初始化一些简单数据
 */
async function initData() {
  await prisma.role.createMany({
    data: [
      {
        name: '普通群众',
        enum: 'USER',
        desc: '普通成员',
        creatorId: 1,
      },
      {
        name: '会员',
        enum: 'VIP',
        desc: '业务管理员',
        creatorId: 1,
      },
      {
        name: '管理员',
        enum: 'ADMIN',
        desc: '系统管理员',
        creatorId: 1,
      },
      {
        name: '超管',
        enum: 'SUPER_ADMIN',
        desc: '系统管理员',
        creatorId: 1,
      },
    ],
  });
}

initData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
