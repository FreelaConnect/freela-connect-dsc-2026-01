import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('proposals')
export class ProposalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projectId: string;

  @Column({ default: 'PENDING' })
  status: string;
}