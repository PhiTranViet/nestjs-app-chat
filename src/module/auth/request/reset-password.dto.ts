import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString, Matches, MaxLength, MinLength} from "class-validator";

export class ResetPassword {
    @ApiProperty({
        type: String,
        example: 'token'
    })
    @IsString()
    token: string;

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