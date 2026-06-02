import { UserResponseDto } from './user-response.dto';

export class PaginatedUserResponseDto {
  data: UserResponseDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  constructor(data: {
    data: UserResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }) {
    this.data = data.data;
    this.page = data.page;
    this.limit = data.limit;
    this.total = data.total;
    this.totalPages = data.totalPages;
  }
}
