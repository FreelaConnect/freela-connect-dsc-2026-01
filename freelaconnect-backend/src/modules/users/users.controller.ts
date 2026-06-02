import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { PaginatedUserResponseDto } from './dto/paginated-user-response.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Query(ValidationPipe) paginationDto: PaginationDto,
  ): Promise<PaginatedUserResponseDto> {
    const page = parseInt(String(paginationDto.page || 1), 10);
    const limit = parseInt(String(paginationDto.limit || 10), 10);
    return this.usersService.getAllUsers(page, limit);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(Number(id), updateUserDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async replaceUser(
    @Param('id') id: string,
    @Body(ValidationPipe) replaceUserDto: ReplaceUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.replaceUser(Number(id), replaceUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id') id: string,
    @Body(ValidationPipe) deleteUserDto: DeleteUserDto,
  ): Promise<{ message: string }> {
    return this.usersService.deleteUser(Number(id), deleteUserDto.version);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.getById(Number(id));
  }
}
