import {ApiProperty} from "@nestjs/swagger";

export class RegisterResponse {

    @ApiProperty({
        type: String,
        example: 'example@gmail.com',
    })
    email: string;

    @ApiProperty({
        type: String,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haW5ndXllbiIsInBhc3N3b3JkIjoiMTIzIiwiaWF0IjoxNTg3NzI3NjE0fQ.V0cWJ_82CcakvCHfNbPLORJ6ShkGJyiC2H1jCQ5Z02s',
    })
    accessToken: string;

    @ApiProperty({
        type: String,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haW5ndXllbiIsInBhc3N3b3JkIjoiMTIzIiwiaWF0IjoxNTg3NzI3NjE0fQ.V0cWJ_82CcakvCHfNbPLORJ6ShkGJyiC2H1jCQ5Z02s',
    })
    refreshToken: string;

}