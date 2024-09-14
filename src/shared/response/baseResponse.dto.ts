import {Meta} from '../../config/rest/meta';
import {ApiResponseProperty} from '@nestjs/swagger';
import {MetaResponse} from './metaResponse.dto';

export class BaseResponse {
    @ApiResponseProperty({
        type: MetaResponse,
        example: {
            code: 200,
            message: 'Successful',
        },
    })
    meta: Meta;
}

export class BaseResponsePagination {
    @ApiResponseProperty({
        type: MetaResponse,
    })
    meta: Meta;
}
