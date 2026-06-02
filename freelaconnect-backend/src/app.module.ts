import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractEntity } from './modules/contract/entities/contract.entities';
import { PaymentEntity } from './modules/payments/entities/payment.entity';
import { ProposalEntity } from './modules/proposals/proposal.entity';
import { ProposalModule } from './modules/proposals/proposal.module';
import { ContractsModule } from './modules/contract/contracts.module';
import { UserEntity } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

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
        entities: [ContractEntity, PaymentEntity, ProposalEntity, UserEntity],
        logging: ['error', 'warn'],
      }),
    }),
    ProposalModule,
    ContractsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
