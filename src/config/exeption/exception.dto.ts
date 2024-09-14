import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * Defines the Json Nest HTTP exception with error code
 * Exceptions Handler.
 *
 * @author PhiTran
 */
export class JsonException extends HttpException {
  constructor(
    message: string | object | any,
    http_status: number,
    error_code: string,
    dynamic_data = null
  ) {
    super(
      {
        message,
        error_code,
        dynamic_data,
      },
      http_status
    );
  }
}



export class I18nException extends HttpException {
  constructor(label, statusCode) {
    super({ label }, statusCode);
  }
}
