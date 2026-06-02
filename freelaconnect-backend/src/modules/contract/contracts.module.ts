import { Module } from "@nestjs/common";
import { ContractEntity } from "./entities/contract.entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractsController } from "./contracts.controller";
import { ContractService } from "./services/contract.service";
import { ContractTypeOrmRepository } from "./repositories/contract-type-orm.repository";
import { CONTRACT_REPOSITORY } from "./repositories/contract.repository.interface";

@Module({
    imports: [
        TypeOrmModule.forFeature([ContractEntity]),
    ],
    controllers: [ContractsController],
    providers: [
        ContractService,
        {
            provide: CONTRACT_REPOSITORY,
            useClass: ContractTypeOrmRepository,
        }    
    ],
    exports: [CONTRACT_REPOSITORY],
})
export class ContractsModule {}
