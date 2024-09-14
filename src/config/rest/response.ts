import { Meta } from './meta';

export interface Response<T> {
  meta: Meta;

  data: T | Array<T>;
}
