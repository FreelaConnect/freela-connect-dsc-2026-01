import {Inject, Injectable} from '@nestjs/common';
import { CONTRACT_REPOSITORY } from '../repositories/contract.repository.interface';
import type { ContractRepository} from '../repositories/contract.repository.interface';
import { ConfirmContractResponseDto } from '../dto/confirm-contract-response.dto';
import { ContractNotFoundException } from '../../../common/exceptions/contract-not-found.exception';

@Injectable()
export class ContractService {
    constructor(
        @Inject(CONTRACT_REPOSITORY)
        private readonly contractRepository: ContractRepository,
    ) {}

    async confirmContract(contractId: string) : Promise<ConfirmContractResponseDto> {
        const contract = await this.contractRepository.findById(contractId);
        if (!contract) {
            throw new ContractNotFoundException(contractId);
        }

        throw new Error('Method not implemented.');
    }
}
