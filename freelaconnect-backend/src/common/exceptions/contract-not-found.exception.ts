import { NotFoundException } from '@nestjs/common';

export class ContractNotFoundException extends NotFoundException {
    constructor(contractId: string) {
        super(`Contract with ID ${contractId} not found`);
    }
}
