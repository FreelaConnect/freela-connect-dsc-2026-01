import { ConflictException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { PaymentStatusEnum } from '../../src/common/enums/payment-status.enuns';
import { ContractService } from '../../src/modules/contract/services/contract.service';
import { PaymentService } from '../../src/modules/payments/services/payment.service';
import {
  buildContractPayload,
  buildPaymentPayload,
  clearDatabase,
  createTestingModule,
} from '../helpers/test-app';

describe('Contracts/Payments integration', () => {
  let moduleRef: TestingModule;
  let contractService: ContractService;
  let paymentService: PaymentService;

  beforeAll(async () => {
    moduleRef = await createTestingModule();
    contractService = moduleRef.get(ContractService, { strict: false });
    paymentService = moduleRef.get(PaymentService, { strict: false });
  });

  beforeEach(async () => {
    await clearDatabase(moduleRef);
  });

  afterAll(async () => {
    await moduleRef?.close();
  });

  it('ContractService cria, lista, busca, atualiza e remove', async () => {
    const created = await contractService.createContract(buildContractPayload());

    await expect(contractService.getAllContracts(1, 10)).resolves.toMatchObject({
      page: 1,
      limit: 10,
      total: 1,
      data: [expect.objectContaining({ contractId: created.contractId })],
    });
    await expect(contractService.getById(created.contractId)).resolves.toMatchObject({
      contractId: created.contractId,
    });

    const updated = await contractService.updateContract(created.contractId, {
      version: created.version,
      status: PaymentStatusEnum.APPROVED,
    });
    expect(updated).toMatchObject({
      status: PaymentStatusEnum.APPROVED,
      version: created.version + 1,
    });

    const replacePayload = buildContractPayload({ status: PaymentStatusEnum.REJECTED });
    const replaced = await contractService.replaceContract(created.contractId, {
      freelancerId: replacePayload.freelancerId,
      orderId: replacePayload.orderId,
      projectId: replacePayload.projectId,
      status: PaymentStatusEnum.REJECTED,
      version: updated.version,
    });
    expect(replaced).toMatchObject({
      status: PaymentStatusEnum.REJECTED,
      version: updated.version + 1,
    });

    await expect(
      contractService.deleteContract(created.contractId, replaced.version),
    ).resolves.toEqual({
      message: `Contrato ${created.contractId} deletado com sucesso`,
    });
  });

  it('ContractService valida conflitos de versao', async () => {
    const created = await contractService.createContract(buildContractPayload());

    await expect(
      contractService.updateContract(created.contractId, {
        version: created.version + 1,
        status: PaymentStatusEnum.APPROVED,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('ContractService confirma contrato', async () => {
    const created = await contractService.createContract(buildContractPayload());

    await expect(contractService.confirmContract(created.contractId)).resolves.toMatchObject({
      id: String(created.contractId),
      status: PaymentStatusEnum.APPROVED,
    });
  });

  it('PaymentService cria, lista, busca, atualiza e remove', async () => {
    const created = await paymentService.createPayment(buildPaymentPayload());

    await expect(paymentService.getAllPayments(1, 10)).resolves.toMatchObject({
      page: 1,
      limit: 10,
      total: 1,
      data: [expect.objectContaining({ paymentId: created.paymentId })],
    });
    await expect(paymentService.getById(created.paymentId)).resolves.toMatchObject({
      paymentId: created.paymentId,
    });

    const updated = await paymentService.updatePayment(created.paymentId, {
      version: created.version,
      status: PaymentStatusEnum.APPROVED,
    });
    expect(updated).toMatchObject({
      status: PaymentStatusEnum.APPROVED,
      version: created.version + 1,
    });

    const replaced = await paymentService.replacePayment(created.paymentId, {
      ...buildPaymentPayload({ amount: 1800, status: PaymentStatusEnum.REJECTED }),
      version: updated.version,
    });
    expect(replaced).toMatchObject({
      status: PaymentStatusEnum.REJECTED,
      version: updated.version + 1,
    });
    expect(Number(replaced.amount)).toBe(1800);

    await expect(paymentService.deletePayment(created.paymentId, replaced.version)).resolves.toEqual({
      message: `Pagamento ${created.paymentId} deletado com sucesso`,
    });
  });

  it('PaymentService valida conflitos de versao', async () => {
    const created = await paymentService.createPayment(buildPaymentPayload());

    await expect(
      paymentService.deletePayment(created.paymentId, created.version + 1),
    ).rejects.toThrow(ConflictException);
  });
});
