import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PaginationResponse } from '../rest/paginationResponse';

export function ApiCommonResponsesList() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Successful retrieval of the user list',
      type: PaginationResponse,
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request. Invalid query parameters',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
    }),
  );
}