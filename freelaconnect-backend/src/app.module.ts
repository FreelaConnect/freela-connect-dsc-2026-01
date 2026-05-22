import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from './modules/contract/entities/contract.entities';
import { PaymentEntity } from './modules/payments/entities/payment.entity';
import { Project } from './modules/project/entities/project.entities';
import { ProposalEntity } from './modules/proposals/entities/proposal.entity';
import { ProposalsModule } from './modules/proposals/proposals.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ConfigModule.forRoot({ isGlobal: true }), 
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: true,
        entities: [ContractEntity, PaymentEntity, ProposalEntity, Project], // <- Adicione Project e ProposalEntity aqui
      }),
    }),
    ProposalsModule, // <- Adicione o módulo aqui
  ],

})
export class AppModule {}
