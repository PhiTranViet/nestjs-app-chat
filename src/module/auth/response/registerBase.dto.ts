import {BaseResponse} from '../../../shared/response/baseResponse.dto';
import {RegisterResponse} from './register.dto';
import {ApiResponseProperty} from '@nestjs/swagger';

export class RegisterBase extends BaseResponse {
    @ApiResponseProperty({
        type: RegisterResponse,
    })
    data: RegisterResponse
}