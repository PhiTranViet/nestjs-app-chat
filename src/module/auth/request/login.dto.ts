import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty} from 'class-validator';

export class Login {
    @ApiProperty({
        type: String,
        example: 'dev@gmail.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        type: String,
        example: '12345678@Abc'
    })
    @IsNotEmpty()
    password: string;
}