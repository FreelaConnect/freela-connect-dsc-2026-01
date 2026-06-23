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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { PaginatedUserResponseDto } from './dto/paginated-user-response.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './services/users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuario' })
  @ApiCreatedResponse({ description: 'Usuario criado com sucesso.', type: UserResponseDto })
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista usuarios com paginacao' })
  @ApiOkResponse({ description: 'Usuarios retornados com sucesso.', type: PaginatedUserResponseDto })
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Query(ValidationPipe) paginationDto: PaginationDto,
  ): Promise<PaginatedUserResponseDto> {
    const page = parseInt(String(paginationDto.page || 1), 10);
    const limit = parseInt(String(paginationDto.limit || 10), 10);
    return this.usersService.getAllUsers(page, limit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza parcialmente um usuario' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: 'Usuario atualizado com sucesso.', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'Usuario nao encontrado.' })
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(Number(id), updateUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Substitui os dados de um usuario' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: 'Usuario substituido com sucesso.', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'Usuario nao encontrado.' })
  @HttpCode(HttpStatus.OK)
  async replaceUser(
    @Param('id') id: string,
    @Body(ValidationPipe) replaceUserDto: ReplaceUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.replaceUser(Number(id), replaceUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um usuario por id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: DeleteUserDto })
  @ApiOkResponse({ description: 'Usuario removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Usuario nao encontrado.' })
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id') id: string,
    @Body(ValidationPipe) deleteUserDto: DeleteUserDto,
  ): Promise<{ message: string }> {
    return this.usersService.deleteUser(Number(id), deleteUserDto.version);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um usuario por id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ description: 'Usuario encontrado.', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'Usuario nao encontrado.' })
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.getById(Number(id));
  }
}
