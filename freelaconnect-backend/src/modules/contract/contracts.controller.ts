import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, ValidationPipe, Patch, Delete, Put, Query } from "@nestjs/common";
import { ContractService } from "./services/contract.service";
import { ConfirmContractResponseDto } from "./dto/confirm-contract-response.dto";
import { ContractResponseDto } from "./dto/contract-response.dto";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { ReplaceContractDto } from "./dto/replace-contract.dto";
import { DeleteContractDto } from "./dto/delete-contract.dto";
import { PaginationDto } from "./dto/pagination.dto";

@Controller('contracts')
export class ContractsController {
    constructor(private readonly contractService: ContractService) {}

    @Post('id/confirm')
    async confirmContract(@Param('id') contractId: number, ): Promise<ConfirmContractResponseDto> {
        return this.contractService.confirmContract(contractId);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createContract(
        @Body(ValidationPipe) createContractDto: CreateContractDto,
    ): Promise<ContractResponseDto> {
        return this.contractService.createContract(createContractDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllContracts(
        @Query(ValidationPipe) paginationDto: PaginationDto,
    ): Promise<any> {
        const page = parseInt(String(paginationDto.page || 1), 10);
        const limit = parseInt(String(paginationDto.limit || 10), 10);
        return this.contractService.getAllContracts(page, limit);
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async updateContract(
        @Param('id') id: string,
        @Body(ValidationPipe) updateContractDto: UpdateContractDto,
    ): Promise<ContractResponseDto> {
        return this.contractService.updateContract(Number(id), updateContractDto);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async replaceContract(
        @Param('id') id: string,
        @Body(ValidationPipe) replaceContractDto: ReplaceContractDto,
    ): Promise<ContractResponseDto> {
        return this.contractService.replaceContract(Number(id), replaceContractDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deleteContract(
        @Param('id') id: string,
        @Body(ValidationPipe) deleteContractDto: DeleteContractDto,
    ): Promise<{ message: string }> {
        return this.contractService.deleteContract(Number(id), deleteContractDto.version);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getById(@Param('id') id: string): Promise<ContractResponseDto> {
        return this.contractService.getById(Number(id));
    }
}