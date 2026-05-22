import { Controller, Post, Body } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';

@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post('submit')
  async submit(@Body() createProposalDto: CreateProposalDto) {
    return this.proposalsService.submit(createProposalDto);
  }
}