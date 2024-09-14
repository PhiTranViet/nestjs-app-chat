import { Pagination } from './pagination';

export class PaginationResponseSummary<T> {
  pagination: Pagination;

  results: Array<T>;


  summary: any;
  constructor(results: Array<T>, pagination: Pagination,summary: any) {
    this.results = results;

    this.pagination = pagination;

    this.summary = summary;
  }
}
