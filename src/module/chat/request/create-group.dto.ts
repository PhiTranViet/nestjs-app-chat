import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  MaxLength,
  MinLength,
  IsArray,
  IsNumber,
  ArrayNotEmpty,
  ArrayUnique,
  IsIn,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class RoleDto {
  @ApiProperty({ description: 'ID of the user', example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Role of the user', example: 'admin' })
  @IsIn(['admin', 'member'])
  role: 'admin' | 'member';
}

export class CreateGroupDto {
  @ApiProperty({
    description: 'The name of the group',
    example: 'Development Team',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;



  @ApiProperty({
    description: 'The description of the group',
    example: 'Development Team',
  })
  @IsString()
  description: string;


  @ApiProperty({
    description: 'Flag to indicate if the group is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

//   @ApiProperty({
//     description: 'List of user IDs to be added to the group',
//     example: [1, 2, 3],
//   })
//   @IsArray()
//   @ArrayNotEmpty()
//   @ArrayUnique()
//   @IsNumber({}, { each: true })
//   userIds: number[];

  @ApiProperty({
    description: 'Roles for each user in the group',
    example: [{ userId: 1, role: 'admin' }, { userId: 2, role: 'member' }],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RoleDto)
  roles: RoleDto[];
}