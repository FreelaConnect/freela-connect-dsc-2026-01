import { Controller, Post, Param } from "@nestjs/common";
import { ContractService } from "./services/contract.service";
import { ConfirmContractResponseDto } from "./dto/confirm-contract-response.dto";

@Controller('contracts')
export class ContractsController {
    constructor(private readonly contractService: ContractService) {}

    @Post('id/confirm')
    async confirmContract(@Param('id') contractId: string, ): Promise<ConfirmContractResponseDto> {
        return this.contractService.confirmContract(contractId);
    }
}