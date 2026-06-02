import { ConflictException } from '@nestjs/common';

export class PaymentVersionConflictException extends ConflictException {
    constructor(paymentId: string, expectedVersion: number, currentVersion: number) {
        super(
            `Conflito de versão para pagamento ${paymentId}. Versão esperada: ${expectedVersion}, versão atual: ${currentVersion}. O pagamento foi modificado por outro usuário.`
        );
    }
}
