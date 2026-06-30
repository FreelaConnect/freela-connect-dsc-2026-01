import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProposalService } from './proposal.service';
import { CreateProposalDto } from './create-proposal.dto';
import { ProposalResponseDto } from './proposal-response.dto';

@ApiTags('Proposals')
@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post('submit')
  @ApiOperation({ summary: 'Envia uma proposta para um projeto' })
  @ApiCreatedResponse({
    description: 'Proposta enviada com sucesso.',
    type: ProposalResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async submitProposal(
    @Body(ValidationPipe) createProposalDto: CreateProposalDto,
  ): Promise<ProposalResponseDto> {
    return this.proposalService.submitProposal(createProposalDto);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Lista propostas de um projeto' })
  @ApiParam({ name: 'projectId', example: 'project-123' })
  @ApiOkResponse({
    description: 'Propostas retornadas com sucesso.',
    type: [ProposalResponseDto],
  })
  @ApiNotFoundResponse({ description: 'Projeto nao encontrado.' })
  @HttpCode(HttpStatus.OK)
  async getProposalsByProject(
    @Param('projectId') projectId: string,
  ): Promise<ProposalResponseDto[]> {
    return this.proposalService.getProposalsByProjectId(projectId);
  }

  @Get(':proposalId')
  @ApiOperation({ summary: 'Busca uma proposta por id' })
  @ApiParam({ name: 'proposalId', example: 'proposal-123' })
  @ApiOkResponse({
    description: 'Proposta encontrada.',
    type: ProposalResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Proposta nao encontrada.' })
  @HttpCode(HttpStatus.OK)
  async getProposal(
    @Param('proposalId') proposalId: string,
  ): Promise<ProposalResponseDto> {
    return this.proposalService.getProposalById(proposalId);
  }
}
