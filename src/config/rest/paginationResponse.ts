import { Pagination } from './pagination';

export class PaginationResponse<T> {
  pagination: Pagination;

  results: Array<T>;

  constructor(results: Array<T>, pagination: Pagination) {
    this.results = results;

    this.pagination = pagination;
  }
}
