import { ContractEntity } from "../entities/contract.entities";


export const CONTRACT_REPOSITORY = 'CONTRACT_REPOSITORY';

export interface ContractRepository {
    findById(contractId: string): Promise<ContractEntity | null>;
    save(contract: ContractEntity): Promise<ContractEntity>;
}

