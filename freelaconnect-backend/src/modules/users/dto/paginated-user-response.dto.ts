import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class PaginatedUserResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];
  @ApiProperty({ example: 1 })
  page: number;
  @ApiProperty({ example: 10 })
  limit: number;
  @ApiProperty({ example: 35 })
  total: number;
  @ApiProperty({ example: 4 })
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
