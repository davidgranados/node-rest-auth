export class PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number
  ) {}

  static create(obj: { [key: string]: any }): [string | null, PaginationDto?] {
    const { page, limit } = obj;
    if (!page) {
      return ["page is required"];
    } else if (isNaN(page) || page < 1){
      return ["page is invalid"];
    }
    if (!limit) {
      return ["limit is required"];
    } else if (isNaN(limit) || limit < 1){
      return ["limit is invalid"];
    }

    return [null, new PaginationDto(page, limit)];
  }
}
