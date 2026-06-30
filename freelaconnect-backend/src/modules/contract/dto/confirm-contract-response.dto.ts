import { ApiProperty } from '@nestjs/swagger';
import { ContractStatusEnum } from '../../../common/enums/contract_status.enum';

export class ConfirmContractResponseDto {
  @ApiProperty({ example: 'contract-123' })
  id: string;

  @ApiProperty({
    enum: ContractStatusEnum,
    example: ContractStatusEnum.APPROVED,
  })
  status: ContractStatusEnum;

  constructor(id: string, status: ContractStatusEnum) {
    this.id = id;
    this.status = status;
  }
}
