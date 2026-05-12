import { Module } from "@nestjs/common";
import { ContractEntity } from "./entities/contract.entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Or } from "typeorm";
import { ContractsController } from "./contracts.controller";
import { ContractService } from "./services/contract.service";




@Module({
    imports: [
        TypeOrmModule.forFeature([ContractEntity]),

    ],
    controllers: [ContractsController],
    providers: [
        ContractService,
        {
            provide: 'CONTRACT_REPOSITORY',
            useClass: ContractEntity,
        }    
    ],
    exports: ['CONTRACT_REPOSITORY'],
})
export class ContractsModule {}
