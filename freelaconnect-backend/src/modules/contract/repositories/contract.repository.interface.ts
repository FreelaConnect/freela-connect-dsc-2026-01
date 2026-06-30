import { ContractEntity } from '../entities/contract.entities';

export const CONTRACT_REPOSITORY = 'CONTRACT_REPOSITORY';

export interface ContractRepository {
  findById(contractId: number): Promise<ContractEntity | null>;
  findAll(
    page?: number,
    limit?: number,
  ): Promise<{ data: ContractEntity[]; total: number }>;
  save(contract: ContractEntity): Promise<ContractEntity>;
  update(
    contractId: number,
    contract: Partial<ContractEntity>,
  ): Promise<ContractEntity | null>;
  delete(contractId: number, version?: number): Promise<boolean>;
}
