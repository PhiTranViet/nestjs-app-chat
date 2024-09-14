import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nException, JsonException } from './exception.dto';

export class Causes {
  public static INTERNAL_ERROR = new I18nException(
    "error.INTERNAL_ERROR",
    HttpStatus.INTERNAL_SERVER_ERROR,
  );


  public static INVALID_REFRESH_TOKEN = new I18nException(
    "error.INVALID_REFRESH_TOKEN",
    HttpStatus.INTERNAL_SERVER_ERROR,
  );

  public static JWT_EXPIRED = new I18nException(
    "error.JWT_EXPIRED",
    HttpStatus.UNAUTHORIZED,
  );

  public static DUPLICATE_PASSWORD = new I18nException(
    "error.DUPLICATE_PASSWORD",
    HttpStatus.BAD_REQUEST,
  );
  

  public static DATA_INVALID = new I18nException(
    "error.DATA_INVALID",
    HttpStatus.BAD_REQUEST,
  );


  public static NOT_AUTH = new I18nException(
    "error.NOT_AUTH",
    HttpStatus.BAD_REQUEST,
  );


  public static EMAIL_OR_PASSWORD_INVALID = new I18nException(
    "error.EMAIL_OR_PASSWORD_INVALID",
    HttpStatus.UNAUTHORIZED,
  );

  public static MISSING_PARAMS = (field: string) => (
    new JsonException(
      `MISSING_PARAMS: ${field}`,
      HttpStatus.BAD_REQUEST,
      'MISSING_PARAMS',
      { field }
    )
  );

  // New causes
  public static USER_NOT_FOUND = new I18nException(
    "error.USER_NOT_FOUND",
    HttpStatus.NOT_FOUND,
  );

  public static PERMISSION_DENIED = new I18nException(
    "error.PERMISSION_DENIED",
    HttpStatus.FORBIDDEN,
  );

  public static INVALID_TOKEN = new I18nException(
    "error.INVALID_TOKEN",
    HttpStatus.UNAUTHORIZED,
  );

  public static DUPLICATE_EMAIL = new I18nException(
    "error.DUPLICATE_EMAIL",
    HttpStatus.CONFLICT,
  );

  public static INVALID_INPUT = (field: string) => (
    new JsonException(
      `INVALID_INPUT: ${field}`,
      HttpStatus.BAD_REQUEST,
      'INVALID_INPUT',
      { field }
    )
  );

  public static RESOURCE_NOT_FOUND = (resource: string) => (
    new JsonException(
      `${resource} not found`,
      HttpStatus.NOT_FOUND,
      'RESOURCE_NOT_FOUND',
      { resource }
    )
  );
  
  public static UNAUTHORIZED_ACCESS = new I18nException(
    "error.UNAUTHORIZED_ACCESS",
    HttpStatus.UNAUTHORIZED,
  );

  public static TOO_MANY_REQUESTS = new I18nException(
    "error.TOO_MANY_REQUESTS",
    HttpStatus.TOO_MANY_REQUESTS,
  );
}