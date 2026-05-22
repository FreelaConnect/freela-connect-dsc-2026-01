import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';
import { ProposalEntity } from './entities/proposal.entity';
import { Project } from '../project/entities/project.entities'; // Confirme se o caminho/nome da exportação bate com o seu arquivo

@Module({
  imports: [
    TypeOrmModule.forFeature([ProposalEntity, Project]), 
  ],
  controllers: [ProposalsController],
  providers: [ProposalsService],
})
export class ProposalsModule {}