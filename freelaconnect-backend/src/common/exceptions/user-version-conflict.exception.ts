import { ConflictException } from '@nestjs/common';

export class UserVersionConflictException extends ConflictException {
  constructor(userId: number, expectedVersion: number, currentVersion: number) {
    super(
      `Conflito de versao para usuario ${userId}. Versao esperada: ${expectedVersion}, versao atual: ${currentVersion}. O usuario foi modificado por outro usuario.`,
    );
  }
}
