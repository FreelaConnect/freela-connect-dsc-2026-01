import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserTypeOrmRepository } from './repositories/user-type-orm.repository';
import { USERS_REPOSITORY } from './repositories/users.repository.interface';
import { UsersService } from './services/users.service';
import { PasswordService } from './services/password.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UsersService,
    PasswordService,
    {
      provide: USERS_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
  ],
  controllers: [UsersController],
  exports: [USERS_REPOSITORY, UsersService, PasswordService],
})
export class UsersModule {}
