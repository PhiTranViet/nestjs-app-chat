import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsIn } from 'class-validator';

export class AddMemberToGroupDto {
  @ApiProperty({
    description: 'ID of the user to be added to the group',
    example: 2,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Role of the user in the group',
    example: 'member',
  })
  @IsIn(['admin', 'member'])
  role: 'admin' | 'member';
}