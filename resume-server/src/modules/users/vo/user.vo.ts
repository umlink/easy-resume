import { RolesEnums } from '@/constants/enums';
import { ApiProperty } from '@nestjs/swagger';

export class UserBaseInfoVO {
  @ApiProperty()
  id: number;
  @ApiProperty({ description: '用户名' })
  username: string;
  @ApiProperty({ description: '邮箱' })
  email: string;
  @ApiProperty({ description: '学校' })
  school: string;
  @ApiProperty({ description: '学科专业' })
  discipline: string;
  @ApiProperty({ description: '年龄' })
  age: number;
  @ApiProperty({ description: '头像' })
  avatar: string;
  @ApiProperty({ description: '是否是 vip' })
  isVip: number;
  @ApiProperty({ description: '职业' })
  profession: string;
  @ApiProperty({ description: '个人爱好' })
  hobby: string;
  @ApiProperty({ description: '个人介绍' })
  introduce: string;
  @ApiProperty({ description: '角色' })
  roles: RolesEnums[];
  @ApiProperty({ description: 'jwt token' })
  accessToken: string;
}
