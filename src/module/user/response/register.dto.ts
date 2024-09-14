import { ApiProperty } from "@nestjs/swagger";

export class RegisterResponse {

  @ApiProperty({
    type: String,
    example: 'example@gmail.com',
  })
  email: string;

}