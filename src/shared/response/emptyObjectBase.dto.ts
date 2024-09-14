import {BaseResponse} from './baseResponse.dto';
import {EmptyObject} from './emptyObject.dto';
import {ApiResponseProperty} from '@nestjs/swagger';

export class EmptyObjectBase extends BaseResponse {
    @ApiResponseProperty({
        type: EmptyObject,
    })
    data: EmptyObject;
}
