import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from "class-validator";

export class Register {
    @ApiProperty({
        type: String,
        example: 'example@gmail.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        type: String,
        example: 'password'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string;
}