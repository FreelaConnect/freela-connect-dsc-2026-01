import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalEntity } from './proposal.entity';
import { ProposalController } from './proposal.controller';
import { ProposalService } from './proposal.service';
import { ProposalTypeOrmRepository } from './proposal-typeorm.repository';
import { PROPOSAL_REPOSITORY } from './proposal.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProposalEntity])],
  controllers: [ProposalController],
  providers: [
    ProposalService,
    {
      provide: PROPOSAL_REPOSITORY,
      useClass: ProposalTypeOrmRepository,
    },
  ],
  exports: [ProposalService],
})
export class ProposalModule {}
