import {BaseResponse} from '../../../shared/response/baseResponse.dto';
import {LoginResponse} from './login.dto';
import {ApiResponseProperty} from '@nestjs/swagger';

export class LoginBase extends BaseResponse {
    @ApiResponseProperty({
        type: LoginResponse,
    })
    data: LoginResponse
}