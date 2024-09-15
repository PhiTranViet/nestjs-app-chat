import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { Causes } from '../config/exeption/causes';
const CryptoJS = require("crypto-js");
export const PUBLIC_IPv4_REGEX =
  /^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(?<!172\.(16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31))(?<!127)(?<!^10)(?<!^0)\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(?<!192\.168)(?<!172\.(16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31))\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export function nowInMillis(): number {
  return Date.now();
}

// Alias for nowInMillis
export function now(): number {
  return nowInMillis();
}

export function nowInSeconds(): number {
  return (nowInMillis() / 1000) | 0;
}

export function addHttps(url: string) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "https://" + url;
  }
  return url;
}

export function checkIPaginationOptions(options: IPaginationOptions): boolean {
  if (options.limit == 0 || options.page == 0) {
    return false;
  }
  return true;
}



export function randomNumberCode(length: number) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



export function convertToString(value: any) {
  return typeof value === "string" ? value : "";
}

export function isNumber(value: any) {
  if (value.match(/^\d+$/)) {
    ///^[+-]?\d+(\.\d+)?$/
    return true;
  } else {
    return false;
  }
}

export function isFloat(value: any) {
  if (value.match(/^[+-]?\d+(\.\d+)?$/)) {
    return true;
  } else {
    return false;
  }
}

export function isPhoneNumber(inputtxt) {
  var phoneno = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/g;
  if (inputtxt.match(phoneno)) {
    return true;
  } else {
    return false;
  }
}


export function getArrayPagination<T>(
  totalItems: any[],
  totalData: number,
  options: any
): Pagination<T> {
  const { limit, page } = options;

  const selectedItems = totalItems;
  let totalRecord = totalData;

  const pagination = {
    totalItems: Number(totalRecord),
    itemCount: Number(totalRecord),
    itemsPerPage: Number(limit),
    totalPages: Math.ceil(Number(totalRecord) / limit),
    currentPage: Number(page),
  };

  return new Pagination(selectedItems, pagination, null);
}

export function getArrayPaginationBuildTotal<T>(
  totalItems: any[],
  totalData: any[],
  options: any
): Pagination<T> {
  const { limit, page } = options;
  const selectedItems = totalItems;
  let totalRecord = 0
  if (totalData.length > 0) {
    totalRecord = totalData[0].total;
  }
  const pagination = {
    totalItems: Number(totalRecord),
    itemCount: Number(totalRecord),
    itemsPerPage: Number(limit),
    totalPages: Math.ceil(Number(totalRecord) / limit),
    currentPage: Number(page),
  };

  return new Pagination(selectedItems, pagination, null);
}



export function requireParams(params: any, keys: string[]) {
  for (let i = 0; i < keys.length; i++) {
    if (params[keys[i]] === null || params[keys[i]] === undefined) {
      throw Causes.MISSING_PARAMS(keys[i]);
    }
  }
}


export function encrypt(data: string) {
  return CryptoJS.MD5(data).toString();
}

export function convertToObject(value: any) {
  return typeof value === "object" ? value : {};
}


export function parseTTL(ttl: string): number {
  const match = ttl.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error('Invalid TTL format');
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's': // seconds
      return value;
    case 'm': // minutes
      return value * 60;
    case 'h': // hours
      return value * 3600;
    case 'd': // days
      return value * 86400;
    default:
      throw new Error('Unsupported time unit');
  }
}