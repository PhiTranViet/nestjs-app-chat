import { IPaginationMeta } from 'nestjs-typeorm-paginate';

export class Pagination {
  itemCount: number;

  totalItems: number;

  itemsPerPage: number;

  totalPages: number;

  currentPage: number;

  constructor(paginationMeta: IPaginationMeta) {
    this.itemCount = paginationMeta.itemCount;
    this.totalItems = paginationMeta.totalItems;
    this.itemsPerPage = paginationMeta.itemsPerPage;
    this.totalPages = paginationMeta.totalPages;
    this.currentPage = paginationMeta.currentPage;
  }
}
