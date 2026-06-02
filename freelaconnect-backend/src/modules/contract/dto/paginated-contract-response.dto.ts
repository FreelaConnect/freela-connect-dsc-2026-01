import { ContractResponseDto } from './contract-response.dto';

export class PaginatedContractResponseDto {
    data: ContractResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;

    constructor(data: {
        data: ContractResponseDto[];
        page: number;
        limit: number;
        total: number;
    }) {
        this.data = data.data;
        this.page = data.page;
        this.limit = data.limit;
        this.total = data.total;
        this.totalPages = Math.ceil(data.total / data.limit);
    }
}
