import { ProposalStatus } from '../../common/enums/proposal-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('proposals')
export class ProposalEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'proposal_id' })
  proposalId!: string;

  @Column({ name: 'project_id' })
  projectId!: string;

  @Column({ name: 'freelancer_id' })
  freelancerId!: string;

  @Column({ name: 'cover_letter', type: 'text' })
  coverLetter!: string;

  @Column({ name: 'proposed_value', type: 'numeric', precision: 10, scale: 2 })
  proposedValue!: number;

  @Column({ name: 'estimated_deadline', type: 'varchar' })
  estimatedDeadline!: string;

  @Column({
    type: 'enum',
    enum: ProposalStatus,
    default: ProposalStatus.PENDING,
  })
  status: ProposalStatus = ProposalStatus.PENDING;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  constructor() {}
}
