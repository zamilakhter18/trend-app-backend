import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClickDto {
  @ApiProperty({
    description: 'The UUID of the product being clicked',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsNotEmpty()
  @IsUUID()
  product_id!: string;
}
