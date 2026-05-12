import { ContractStatusEnum} from '../../../common/enums/contract_status.enum';

export class ConfirmContractResponseDto {
    constructor(
        public id: string,
        public status: ContractStatusEnum,
    ) {}
}
