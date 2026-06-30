import { ConflictException } from '@nestjs/common';

export class ContractVersionConflictException extends ConflictException {
  constructor(
    contractId: number,
    expectedVersion: number,
    currentVersion: number,
  ) {
    super(
      `Conflito de versão para contrato ${contractId}. Versão esperada: ${expectedVersion}, versão atual: ${currentVersion}. O contrato foi modificado por outro usuário.`,
    );
  }
}
