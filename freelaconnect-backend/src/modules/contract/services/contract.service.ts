import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CONTRACT_REPOSITORY } from '../repositories/contract.repository.interface';
import type { ContractRepository } from '../repositories/contract.repository.interface';
import { ConfirmContractResponseDto } from '../dto/confirm-contract-response.dto';
import { ContractResponseDto } from '../dto/contract-response.dto';
import { CreateContractDto } from '../dto/create-contract.dto';
import { UpdateContractDto } from '../dto/update-contract.dto';
import { ReplaceContractDto } from '../dto/replace-contract.dto';
import { ContractNotFoundException } from '../../../common/exceptions/contract-not-found.exception';
import { ContractEntity } from '../entities/contract.entities';
import { PaymentStatusEnum } from '../../../common/enums/payment-status.enuns';
import { ContractStatusEnum } from '../../../common/enums/contract_status.enum';

@Injectable()
export class ContractService {
  constructor(
    @Inject(CONTRACT_REPOSITORY)
    private readonly contractRepository: ContractRepository,
  ) {}

  async confirmContract(
    contractId: number,
  ): Promise<ConfirmContractResponseDto> {
    const contract = await this.contractRepository.findById(contractId);
    if (!contract) {
      throw new ContractNotFoundException(contractId);
    }

    await this.contractRepository.update(contractId, {
      status: PaymentStatusEnum.APPROVED,
      version: contract.version,
    });
    return new ConfirmContractResponseDto(
      String(contractId),
      ContractStatusEnum.APPROVED,
    );
  }

  async getById(contractId: number): Promise<ContractResponseDto> {
    const contract = await this.contractRepository.findById(contractId);
    if (!contract) {
      throw new ContractNotFoundException(contractId);
    }

    return new ContractResponseDto({
      contractId: contract.contractId,
      freelancerId: contract.freelancerId,
      orderId: contract.orderId,
      projectId: contract.projectId,
      status: contract.status,
      version: contract.version,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
      deletedAt: contract.deletedAt,
    });
  }

  async getAllContracts(page: number = 1, limit: number = 10): Promise<any> {
    const { data, total } = await this.contractRepository.findAll(page, limit);

    const mappedData = data.map(
      (contract) =>
        new ContractResponseDto({
          contractId: contract.contractId,
          freelancerId: contract.freelancerId,
          orderId: contract.orderId,
          projectId: contract.projectId,
          status: contract.status,
          version: contract.version,
          createdAt: contract.createdAt,
          updatedAt: contract.updatedAt,
          deletedAt: contract.deletedAt,
        }),
    );

    return {
      data: mappedData,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createContract(
    createContractDto: CreateContractDto,
  ): Promise<ContractResponseDto> {
    const contract = new ContractEntity();
    contract.freelancerId = createContractDto.freelancerId;
    contract.orderId = createContractDto.orderId;
    contract.projectId = createContractDto.projectId;
    contract.status = createContractDto.status || PaymentStatusEnum.PENDING;

    const savedContract = await this.contractRepository.save(contract);

    return new ContractResponseDto({
      contractId: savedContract.contractId,
      freelancerId: savedContract.freelancerId,
      orderId: savedContract.orderId,
      projectId: savedContract.projectId,
      status: savedContract.status,
      version: savedContract.version,
      createdAt: savedContract.createdAt,
      updatedAt: savedContract.updatedAt,
      deletedAt: savedContract.deletedAt,
    });
  }

  async updateContract(
    contractId: number,
    updateContractDto: UpdateContractDto,
  ): Promise<ContractResponseDto> {
    const contract = await this.contractRepository.findById(contractId);
    if (!contract) {
      throw new ContractNotFoundException(contractId);
    }

    const updatedContract = await this.contractRepository.update(
      contractId,
      updateContractDto,
    );
    if (!updatedContract) {
      throw new NotFoundException(
        `Falha ao atualizar contrato com ID ${contractId}`,
      );
    }

    return new ContractResponseDto({
      contractId: updatedContract.contractId,
      freelancerId: updatedContract.freelancerId,
      orderId: updatedContract.orderId,
      projectId: updatedContract.projectId,
      status: updatedContract.status,
      version: updatedContract.version,
      createdAt: updatedContract.createdAt,
      updatedAt: updatedContract.updatedAt,
      deletedAt: updatedContract.deletedAt,
    });
  }

  async replaceContract(
    contractId: number,
    replaceContractDto: ReplaceContractDto,
  ): Promise<ContractResponseDto> {
    const contract = await this.contractRepository.findById(contractId);
    if (!contract) {
      throw new ContractNotFoundException(contractId);
    }

    const replacedContract = await this.contractRepository.update(
      contractId,
      replaceContractDto,
    );
    if (!replacedContract) {
      throw new NotFoundException(
        `Falha ao substituir contrato com ID ${contractId}`,
      );
    }

    return new ContractResponseDto({
      contractId: replacedContract.contractId,
      freelancerId: replacedContract.freelancerId,
      orderId: replacedContract.orderId,
      projectId: replacedContract.projectId,
      status: replacedContract.status,
      version: replacedContract.version,
      createdAt: replacedContract.createdAt,
      updatedAt: replacedContract.updatedAt,
      deletedAt: replacedContract.deletedAt,
    });
  }

  async deleteContract(
    contractId: number,
    version?: number,
  ): Promise<{ message: string }> {
    const contract = await this.contractRepository.findById(contractId);
    if (!contract) {
      throw new ContractNotFoundException(contractId);
    }

    const deleted = await this.contractRepository.delete(contractId, version);
    if (!deleted) {
      throw new NotFoundException(
        `Falha ao deletar contrato com ID ${contractId}`,
      );
    }

    return { message: `Contrato ${contractId} deletado com sucesso` };
  }
}
