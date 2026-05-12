import { Test } from '@nestjs/testing';
import { ContractService } from './contract.service';
import { CONTRACT_REPOSITORY } from '../repositories/contract.repository.interface';
import type { ContractRepository } from '../repositories/contract.repository.interface';
import { PAYMENTS_REPOSITORY} from 'src/modules/payments/repositories/payments.repository.interface';
import type { PaymentsRepository } from 'src/modules/payments/repositories/payments.repository.interface';

describe('ContractService', () => {
    let contractService: ContractService;
    let contractRepository: jest.Mocked<ContractRepository>;
    let paymentRepository: jest.Mocked<PaymentsRepository>;  

    beforeEach(async () => {
        const contractRepositoryMock: ContractRepository = {
            findById: jest.fn(),
            save: jest.fn(),
        };

        const paymentRepositoryMock: PaymentsRepository = {
            findByOrderId: jest.fn(),
        };
        

        const module = await Test.createTestingModule({
            providers: [ContractService, { 
                provide: CONTRACT_REPOSITORY, 
                useValue: contractRepositoryMock },
                { 
                    provide: PAYMENTS_REPOSITORY, 
                    useValue: paymentRepositoryMock }
                ],
        }).compile();

        contractService = module.get<ContractService>(ContractService);
        contractRepository = module.get(CONTRACT_REPOSITORY);
        paymentRepository = module.get(PAYMENTS_REPOSITORY);
    });

    it('should fail when contract is not defined', async () => {
        contractRepository.findById.mockResolvedValue(null);

        await expect(contractService.confirmContract('1')).rejects.toThrow('Contract not found');
        expect (paymentRepository.findByOrderId).not.toHaveBeenCalled();
        expect (contractRepository.save).not.toHaveBeenCalled();
    });
});
