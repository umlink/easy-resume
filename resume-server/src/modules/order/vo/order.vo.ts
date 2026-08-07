import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderVO {
  @ApiProperty()
  orderId: string;
  @ApiProperty()
  payImgUrl: string;
}
