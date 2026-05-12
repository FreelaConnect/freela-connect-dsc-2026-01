import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContractEntity } from "../entities/contract.entities";
import { Repository } from "typeorm/browser/repository/Repository.js";

@Injectable()
export class ContractTypeOrmRepository{
    constructor(
        @InjectRepository(ContractEntity)
        private readonly contractRepository: Repository<ContractEntity>,
    ) {}
    
    async findById(contractId: string): Promise<ContractEntity | null> {
        return this.contractRepository.findOne({ where: { contractId } });
    }
    
    async save(contract: ContractEntity): Promise<ContractEntity> {
        return this.contractRepository.save(contract);

    }
}
