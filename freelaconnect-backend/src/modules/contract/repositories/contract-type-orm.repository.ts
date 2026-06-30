import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractEntity } from '../entities/contract.entities';
import { Repository, IsNull } from 'typeorm';
import { ContractVersionConflictException } from '../../../common/exceptions/contract-version-conflict.exception';

@Injectable()
export class ContractTypeOrmRepository {
  constructor(
    @InjectRepository(ContractEntity)
    private readonly contractRepository: Repository<ContractEntity>,
  ) {}

  async findById(contractId: number): Promise<ContractEntity | null> {
    return this.contractRepository.findOne({ where: { contractId } });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: ContractEntity[]; total: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.contractRepository.findAndCount({
      where: { deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
    });

    return { data, total };
  }

  async save(contract: ContractEntity): Promise<ContractEntity> {
    return this.contractRepository.save(contract);
  }

  async update(
    contractId: number,
    contractData: Partial<ContractEntity>,
  ): Promise<ContractEntity | null> {
    const contract = await this.findById(contractId);
    if (!contract) {
      return null;
    }

    const clientVersion = (contractData as any).version;
    if (clientVersion !== undefined && clientVersion !== contract.version) {
      throw new ContractVersionConflictException(
        contractId,
        clientVersion,
        contract.version,
      );
    }

    Object.assign(contract, contractData);
    contract.version = contract.version + 1;

    await this.contractRepository.update({ contractId }, contract);
    return this.findById(contractId);
  }

  async delete(contractId: number, version?: number): Promise<boolean> {
    const contract = await this.findById(contractId);
    if (!contract) {
      return false;
    }

    if (version !== undefined && version !== contract.version) {
      throw new ContractVersionConflictException(
        contractId,
        version,
        contract.version,
      );
    }

    contract.deletedAt = new Date();
    await this.contractRepository.save(contract);
    return true;
  }
}
