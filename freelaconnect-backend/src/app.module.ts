import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from './modules/contract/entities/contract.entities';
import { PaymentEntity } from './modules/payments/entities/payment.entity';
import { ProposalEntity } from './modules/proposals/proposal.entity';
import { ProposalModule } from './modules/proposals/proposal.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        synchronize: true,
        entities: [ContractEntity, PaymentEntity, ProposalEntity],
        logging: ['error', 'warn'],
      }),
    }),
    ProposalModule,
  ],
})
export class AppModule {}
