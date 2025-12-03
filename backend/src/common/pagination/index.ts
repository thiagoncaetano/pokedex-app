const PER_PAGE_DEFAULT = 10;
const PAGE_DEFAULT = 1;

export class PaginateParams {
  rows = [];
  page: number;
  perPage: number;

  constructor(page: number | string, perPage: number | string) {
    const currentPage = page && page !== '' ? Number(page) : PAGE_DEFAULT;
    const currentPerPage = perPage && perPage !== '' ? Number(perPage) : PER_PAGE_DEFAULT;
    this.page = isNaN(currentPage) ? PAGE_DEFAULT : currentPage;
    this.perPage = isNaN(currentPerPage) ? PER_PAGE_DEFAULT : currentPerPage;
  }

  get skip() {
    return (this.page - 1) * this.perPage;
  }

  get take() {
    return this.perPage;
  }
}

export class PaginateEntity {
  constructor(
    public page: number,
    public count: number,
    public perPage: number,
  ) {}

  get totalPages() {
    return Math.ceil(this.count / this.perPage);
  }
}

export class PaginatePresenter {
  static render(paginate: PaginateEntity) {
    return {
      page: paginate.page,
      total: paginate.count,
      totalPages: paginate.totalPages,
      perPage: paginate.perPage,
    };
  }
}
