import { Test } from '@nestjs/testing';
import { ContractService } from './contract.service';
import { CONTRACT_REPOSITORY } from '../repositories/contract.repository.interface';
import type { ContractRepository } from '../repositories/contract.repository.interface';

describe('ContractService', () => {
    let contractService: ContractService;
    let contractRepository: jest.Mocked<ContractRepository>;

    beforeEach(async () => {
        const contractRepositoryMock: ContractRepository = {
            findById: jest.fn(),
            findAll: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        

        const module = await Test.createTestingModule({
            providers: [ContractService, { 
                provide: CONTRACT_REPOSITORY, 
                useValue: contractRepositoryMock },
            ],
        }).compile();

        contractService = module.get<ContractService>(ContractService);
        contractRepository = module.get(CONTRACT_REPOSITORY);
    });

    it('should fail when contract is not defined', async () => {
        contractRepository.findById.mockResolvedValue(null);

        await expect(contractService.confirmContract(1)).rejects.toThrow('Contract with ID 1 not found');
        expect (contractRepository.save).not.toHaveBeenCalled();
    });
});
