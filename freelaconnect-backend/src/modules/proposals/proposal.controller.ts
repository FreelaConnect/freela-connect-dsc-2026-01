import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { CreateProposalDto } from './create-proposal.dto';
import { ProposalResponseDto } from './proposal-response.dto';

@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post('submit')
  @HttpCode(HttpStatus.CREATED)
  async submitProposal(
    @Body(ValidationPipe) createProposalDto: CreateProposalDto,
  ): Promise<ProposalResponseDto> {
    return this.proposalService.submitProposal(createProposalDto);
  }

  @Get(':proposalId')
  @HttpCode(HttpStatus.OK)
  async getProposal(@Param('proposalId') proposalId: string): Promise<ProposalResponseDto> {
    return this.proposalService.getProposalById(proposalId);
  }

  @Get('project/:projectId')
  @HttpCode(HttpStatus.OK)
  async getProposalsByProject(
    @Param('projectId') projectId: string,
  ): Promise<ProposalResponseDto[]> {
    return this.proposalService.getProposalsByProjectId(projectId);
  }
}
