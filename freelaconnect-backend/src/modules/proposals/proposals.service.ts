import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProposalEntity } from './entities/proposal.entity';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { Project } from '../project/entities/project.entities';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(ProposalEntity)
    private readonly proposalRepository: Repository<ProposalEntity>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async submit(createProposalDto: CreateProposalDto): Promise<ProposalEntity> {
    const { projectId } = createProposalDto;

    // 1. Verifica se o projeto existe usando o método nativo do TypeORM
    const project = await this.projectRepository.findOne({ where: { id: projectId } });

    // 2. Se não existir, retorna erro 404 Not Found
    if (!project) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    // 3. Se existir, cria a proposta com status padrão PENDING
    const proposal = this.proposalRepository.create({
      projectId,
    });

    return this.proposalRepository.save(proposal);
  }
}