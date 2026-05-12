# Documentação Técnica — Freela Connect

**Última atualização:** 2026-05-12  
**Versão:** 1.0.0  
**Propósito:** Guia arquitetural para equipe de desenvolvimento e agentes de IA

---

## Sumário

1. [Visão Geral e Stack Tecnológico](#1-visão-geral-e-stack-tecnológico)
2. [Arquitetura e Estrutura](#2-arquitetura-e-estrutura)
3. [Modelagem de Domínio e Regras de Negócio](#3-modelagem-de-domínio-e-regras-de-negócio)
4. [Padrões e Guidelines (CRÍTICO)](#4-padrões-e-guidelines-crítico)
5. [Guia de Contribuição](#5-guia-de-contribuição)
6. [Referências e Recursos](#6-referências-e-recursos)

---

## 1. Visão Geral e Stack Tecnológico

### 1.1 O Projeto Freela Connect

O **Freela Connect** é uma plataforma digital que conecta clientes e freelancers, facilitando o processo de contratação, gestão de serviços, avaliação e pagamento. O projeto é estruturado com uma arquitetura de backend robusto, seguindo princípios de Clean Architecture e Domain-Driven Design.

### 1.2 Stack Tecnológico

#### Backend (Node.js + NestJS)

| Tecnologia | Versão | Propósito |
|---|---|---|
| **Node.js** | v22+ | Runtime JavaScript/TypeScript |
| **NestJS** | 11.0.1 | Framework web com injeção de dependência, modularidade e arquitetura scalable |
| **TypeScript** | 5.7.3 | Tipagem estática e segurança de tipos |
| **TypeORM** | 0.3.28 | ORM para abstração de banco de dados e relacionamentos |
| **PostgreSQL** | 8.20.0 | Banco de dados relacional principal |
| **Jest** | 30.0.0 | Framework de testes unitários e cobertura |
| **ts-jest** | 29.2.5 | Transformador TypeScript para Jest |
| **ESLint** | 9.18.0 | Linter para qualidade de código |
| **Prettier** | 3.4.2 | Formatador de código automático |
| **@nestjs/config** | 4.0.4 | Gerenciamento de variáveis de ambiente |
| **@nestjs/typeorm** | 11.0.1 | Integração TypeORM com NestJS |

#### Ferramentas de Desenvolvimento

| Ferramenta | Versão | Uso |
|---|---|---|
| **pnpm** | Latest | Package manager (workspaces suportado) |
| **ts-node** | 10.9.2 | Execução de TypeScript sem compilação |
| **tsconfig-paths** | 4.2.0 | Suporte a path aliases no TypeScript |
| **@nestjs/cli** | 11.0.0 | CLI para scaffolding NestJS |
| **@nestjs/schematics** | 11.0.0 | Templates para NestJS CLI |

### 1.3 Arquitetura em Alto Nível

```
┌─────────────────────────────────────┐
│   Cliente HTTP / API REST           │
└────────────────┬────────────────────┘
                 │
┌─────────────────────────────────────┐
│   NestJS Application (Port 3002)    │
├─────────────────────────────────────┤
│   Controllers (HTTP Layer)          │
├─────────────────────────────────────┤
│   Services (Business Logic)         │
├─────────────────────────────────────┤
│   Repositories (Data Access)        │
├─────────────────────────────────────┤
│   TypeORM (ORM)                     │
└────────────────┬────────────────────┘
                 │
┌─────────────────────────────────────┐
│   PostgreSQL Database               │
└─────────────────────────────────────┘
```

---

## 2. Arquitetura e Estrutura

### 2.1 Organização de Diretórios

O projeto segue o padrão de **módulos por domínio** (Domain-Driven Design), onde cada módulo representa um contexto de negócio isolado.

```
freelaconnect-backend/src/
│
├── modules/                                 # Módulos por domínio
│   │
│   ├── contract/                           # Domínio de Contratos
│   │   ├── entities/
│   │   │   └── contract.entities.ts        # Entity com regras de validação
│   │   ├── repositories/
│   │   │   ├── contract.repository.interface.ts  # Interface (contrato)
│   │   │   └── contract-type-orm.repository.ts   # Implementação TypeORM
│   │   ├── services/
│   │   │   ├── contract.service.ts         # Lógica de negócio
│   │   │   └── contract.service.spec.ts    # Testes unitários
│   │   ├── controllers/
│   │   │   └── contracts.controller.ts     # Endpoints HTTP
│   │   ├── dto/
│   │   │   └── confirm-contract-response.dto.ts  # Data Transfer Object
│   │   └── contracts.module.ts             # Definição do módulo NestJS
│   │
│   ├── payments/                           # Domínio de Pagamentos
│   │   ├── entities/
│   │   │   └── payment.entity.ts
│   │   ├── repositories/
│   │   │   ├── payments.repository.interface.ts
│   │   │   └── payment-type-orm.repository.ts
│   │   └── payment.module.ts
│   │
│   ├── project/                            # Domínio de Projetos
│   │   ├── entities/
│   │   │   └── project.entities.ts
│   │   ├── repositories/
│   │   │   └── project.repository.interface.ts
│   │   └── project.module.ts
│   │
│   └── common/                             # Código compartilhado
│       ├── exceptions/                     # Exceções customizadas
│       │   └── contract-not-found.exception.ts
│       └── enums/                          # Enumerações de domínio
│           ├── contract_status.enum.ts
│           └── payment-status.enums.ts
│
├── app.module.ts                           # Módulo raiz
├── app.controller.ts
├── app.service.ts
├── main.ts                                 # Entry point
│
└── test/                                   # Testes E2E (não unitários)
    └── jest-e2e.json
```

### 2.2 Padrão de Repositório (Repository Pattern)

O projeto implementa o **Repository Pattern** para abstração de dados, permitindo trocar a implementação de banco sem alterar a lógica de negócio.

#### 2.2.1 Interface de Repositório

A interface define o **contrato** que qualquer implementação deve cumprir:

```typescript
// src/modules/contract/repositories/contract.repository.interface.ts

export const CONTRACT_REPOSITORY = 'CONTRACT_REPOSITORY';

export interface ContractRepository {
    findById(contractId: string): Promise<ContractEntity | null>;
    save(contract: ContractEntity): Promise<ContractEntity>;
}
```

#### 2.2.2 Implementação TypeORM

A implementação concreta usa TypeORM para se comunicar com o banco:

```typescript
// src/modules/contract/repositories/contract-type-orm.repository.ts

@Injectable()
export class ContractTypeOrmRepository implements ContractRepository {
    constructor(
        @InjectRepository(ContractEntity)
        private readonly contractRepository: Repository<ContractEntity>,
    ) {}
    
    async findById(contractId: string): Promise<ContractEntity | null> {
        return this.contractRepository.findOne({ where: { contractId } });
    }
    
    async save(contract: ContractEntity): Promise<ContractEntity> {
        return this.contractRepository.save(contract);
    }
}
```

#### 2.2.3 Benefícios

- ✅ **Testabilidade:** Fácil mockear repositório em testes unitários
- ✅ **Desacoplamento:** Serviço não conhece TypeORM
- ✅ **Flexibilidade:** Trocar PostgreSQL por MongoDB sem alterar serviço
- ✅ **Manutenibilidade:** Lógica de acesso a dados centralizada

### 2.3 Injeção de Dependência (Dependency Injection)

NestJS usa **injeção de dependência via construtores** com o decorador `@Inject()`.

#### 2.3.1 Usando Tokens

```typescript
// Service recebe repositório via token
@Injectable()
export class ContractService {
    constructor(
        @Inject(CONTRACT_REPOSITORY)  // Token injetado
        private readonly contractRepository: ContractRepository,
    ) {}
}
```

#### 2.3.2 Provendo a Implementação

No módulo, vinculamos o token à implementação:

```typescript
// src/modules/contract/contracts.module.ts

@Module({
    imports: [TypeOrmModule.forFeature([ContractEntity])],
    controllers: [ContractsController],
    providers: [
        ContractService,
        {
            provide: CONTRACT_REPOSITORY,  // Token
            useClass: ContractTypeOrmRepository,  // ✅ Implementação correta
        }    
    ],
    exports: [CONTRACT_REPOSITORY],
})
export class ContractsModule {}
```

**⚠️ IMPORTANTE:** `useClass` deve apontar para a classe do repositório, não para a Entity.

### 2.4 Fluxo de Requisição

```
HTTP Request
    ↓
ContractsController
    ↓
@Post('contracts/:id/confirm')
    ↓
ContractService.confirmContract(contractId)
    ↓
ContractRepository.findById(contractId)  [via Inject]
    ↓
TypeORM Query → PostgreSQL
    ↓
ContractEntity ou null
    ↓
Validação de Regras de Negócio
    ↓
Exceção Customizada ou HTTP Response
```

---

## 3. Modelagem de Domínio e Regras de Negócio

### 3.1 Entidades Principais

#### 3.1.1 ContractEntity

Representa um contrato entre um freelancer e um cliente para um projeto específico.

```typescript
@Entity('contracts')
export class ContractEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'contract_id' })
    contractId: string;

    @Column({ name: 'freelancer_id' })
    freelancerId: string;

    @Column({ name: 'order_id' })
    orderId: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @Column({ 
        type: 'enum',
        enum: PaymentStatusEnum,
        default: PaymentStatusEnum.PENDING,
    })
    status: PaymentStatusEnum;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @CreateDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date | null;
}
```

**Campos:**
- `contractId` (UUID): Identificador único do contrato
- `freelancerId`: ID do freelancer participante
- `orderId`: ID da ordem/pedido associado
- `projectId`: ID do projeto origem
- `status`: Estado do contrato (PENDING, APPROVED, REJECTED, CANCELLED)
- `createdAt`, `updatedAt`, `deletedAt`: Timestamps

#### 3.1.2 PaymentEntity

Representa um pagamento associado a um contrato.

```typescript
@Entity('payments')
export class PaymentEntity {
    // Estrutura semelhante a ContractEntity
    // Campos: paymentId, orderId, amount, status, createdAt, updatedAt
}
```

**Responsabilidade:** Rastrear transações e validar status de pagamento.

#### 3.1.3 Project

Representa um projeto que um cliente publica para que freelancers façam propostas.

```typescript
export class Project {
    id: string;
    title: string;
    description: string;
    contractId: string;        // ID do contrato associado
    budget: number;            // Orçamento do projeto
    createdAt: Date;
    updatedAt: Date;
}
```

### 3.2 Regras de Negócio do Caso de Uso Principal: Confirmar Contrato

O endpoint `POST /contracts/:id/confirm` implementa a lógica de **confirmação de um contrato**. Suas regras são:

#### Regra 1: Contrato Deve Existir
```
Pré-condição: ContractEntity com contractId fornecido existe no banco
Ação: Buscar contrato via ContractRepository.findById()
Exceção: Se não encontrar → ContractNotFoundException
```

#### Regra 2: Status Válido
```
Pré-condição: Contrato deve estar em status PENDING
Validação: if (contract.status !== PaymentStatusEnum.PENDING) throw InvalidStatusException
```

#### Regra 3: Pagamento Associado
```
Pré-condição: Deve existir pagamento associado ao orderId do contrato
Busca: PaymentsRepository.findByOrderId(contract.orderId)
Exceção: Se não houver pagamento → PaymentNotFoundException
```

#### Regra 4: Pagamento Confirmado
```
Pré-condição: Pagamento deve estar em status COMPLETED ou APPROVED
Validação: if (payment.status !== PaymentStatusEnum.COMPLETED) throw PaymentNotConfirmedException
```

#### Regra 5: Atualizar Status do Contrato
```
Ação: Atualizar contract.status = ContractStatusEnum.APPROVED
Ação: Atualizar contract.updatedAt = agora
Persistência: ContractRepository.save(contract)
Retorno: ConfirmContractResponseDto com dados do contrato atualizado
```

### 3.3 Fluxo de Validações (Confirmação de Contrato)

```
confirmContract(contractId: string)
    ↓
    ├─→ [RED] Contrato não existe?
    │   └─→ throw ContractNotFoundException ❌
    │
    ├─→ [RED] Status não é PENDING?
    │   └─→ throw InvalidContractStatusException ❌
    │
    ├─→ [RED] Pagamento não existe?
    │   └─→ throw PaymentNotFoundException ❌
    │
    ├─→ [RED] Pagamento não confirmado?
    │   └─→ throw PaymentNotConfirmedException ❌
    │
    └─→ [GREEN] Todas validações passaram ✅
        ├─→ contract.status = APPROVED
        ├─→ contract.updatedAt = now()
        ├─→ save(contract)
        └─→ return ConfirmContractResponseDto
```

---

## 4. Padrões e Guidelines (CRÍTICO)

### 4.1 Injeção de Dependência (DI) via Tokens

#### Obrigação 1: Sempre Use Tokens para Abstrações

✅ **CORRETO:**
```typescript
// Interface define contrato
export const CONTRACT_REPOSITORY = 'CONTRACT_REPOSITORY';
export interface ContractRepository { /* ... */ }

// Serviço injeta via token
@Injectable()
export class ContractService {
    constructor(
        @Inject(CONTRACT_REPOSITORY)
        private readonly repo: ContractRepository,
    ) {}
}

// Módulo fornece implementação
@Module({
    providers: [
        { provide: CONTRACT_REPOSITORY, useClass: ContractTypeOrmRepository }
    ]
})
```

❌ **INCORRETO:**
```typescript
// Injetar implementação diretamente (não testável)
@Injectable()
export class ContractService {
    constructor(private readonly repo: ContractTypeOrmRepository) {}
}
```

#### Obrigação 2: Estrutura de Token

Todos os tokens devem:
1. Estar definidos como `export const` na interface
2. Usar nomenclatura SCREAMING_SNAKE_CASE: `MINHA_INTERFACE_TOKEN`
3. Ser documentados com comentário

```typescript
/**
 * Token para injetar implementação de ContractRepository.
 * Qualquer classe que implemente ContractRepository pode ser fornecida.
 */
export const CONTRACT_REPOSITORY = 'CONTRACT_REPOSITORY';
export interface ContractRepository {
    // Contrato
}
```

### 4.2 Exceções de Domínio Customizadas

#### Obrigação 1: Exceções Estendem de NestJS Exceptions

✅ **CORRETO:**
```typescript
// Estende NotFoundException do NestJS
import { NotFoundException } from '@nestjs/common';

export class ContractNotFoundException extends NotFoundException {
    constructor(contractId: string) {
        super(`Contract with ID ${contractId} not found`);
    }
}
```

❌ **INCORRETO:**
```typescript
// Estende Error genérico (perde tratamento do NestJS)
export class ContractNotFoundException extends Error {
    constructor(contractId: string) {
        super(`Contract not found: ${contractId}`);
    }
}
```

#### Obrigação 2: Exceções por Contexto de Negócio

Crie exceções específicas para cada violação de regra:

```typescript
// ✅ Crie tipos específicos
export class InvalidContractStatusException extends BadRequestException {
    constructor(status: string) {
        super(`Cannot confirm contract with status: ${status}`);
    }
}

export class PaymentNotConfirmedException extends BadRequestException {
    constructor(orderId: string) {
        super(`Payment for order ${orderId} is not confirmed`);
    }
}
```

#### Obrigação 3: Localizar Exceções em `/common/exceptions`

Todas as exceções customizadas devem estar em:
```
src/common/exceptions/
├── contract-not-found.exception.ts
├── invalid-contract-status.exception.ts
├── payment-not-confirmed.exception.ts
└── ...
```

#### Obrigação 4: Sempre Lançar Exceções em Serviços

```typescript
@Injectable()
export class ContractService {
    async confirmContract(contractId: string) {
        const contract = await this.repo.findById(contractId);
        
        // ✅ Lançar exceção se não encontrar
        if (!contract) {
            throw new ContractNotFoundException(contractId);
        }
        
        // ✅ Validar regra de negócio e lançar exceção
        if (contract.status !== ContractStatusEnum.PENDING) {
            throw new InvalidContractStatusException(contract.status);
        }
    }
}
```

### 4.3 🚨 **TDD — TEST-DRIVEN DEVELOPMENT (OBRIGATÓRIO)**

#### 🔴 **RED-GREEN-REFACTOR É MANDATÓRIO**

Este é o padrão **não-negociável** para todo desenvolvimento no Freela Connect.

#### Obrigação 1: Testes Unitários ANTES da Implementação

**NENHUMA funcionalidade deve ser iniciada sem:**

1. ✅ Escrever testes unitários em arquivo `*.spec.ts`
2. ✅ Testes **falhando** (RED) — validar que falham por razão correta
3. ✅ Implementar lógica para passar nos testes (GREEN)
4. ✅ Refatorar código mantendo testes passando (REFACTOR)

#### Obrigação 2: Ciclo Red-Green-Refactor Explícito

```
Fase 1: RED
   └─→ Escrever teste que FALHA (funcionalidade ainda não implementada)
   └─→ Verificar mensagem de erro (teste está testando certo?)

Fase 2: GREEN
   └─→ Implementar o MÍNIMO necessário para passar no teste
   └─→ Todos os testes passam? ✅
   └─→ Implementação correta porém "feia"? OK nesta fase

Fase 3: REFACTOR
   └─→ Melhorar código: legibilidade, duplicação, performance
   └─→ Testes ainda passam? ✅ (obrigatório)
   └─→ Código está limpo? ✅
```

#### Obrigação 3: Estrutura de Testes Unitários

Todos os testes devem estar em `src/**/*.spec.ts`:

```typescript
// src/modules/contract/services/contract.service.spec.ts

import { Test } from '@nestjs/testing';
import { ContractService } from './contract.service';
import { CONTRACT_REPOSITORY } from '../repositories/contract.repository.interface';
import type { ContractRepository } from '../repositories/contract.repository.interface';

describe('ContractService', () => {
    let service: ContractService;
    let repository: jest.Mocked<ContractRepository>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ContractService,
                {
                    provide: CONTRACT_REPOSITORY,
                    useValue: {
                        findById: jest.fn(),
                        save: jest.fn(),
                    }
                }
            ],
        }).compile();

        service = module.get<ContractService>(ContractService);
        repository = module.get(CONTRACT_REPOSITORY);
    });

    describe('confirmContract', () => {
        it('should throw ContractNotFoundException when contract does not exist', async () => {
            // Arrange
            const contractId = 'invalid-id';
            repository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(service.confirmContract(contractId))
                .rejects
                .toThrow(ContractNotFoundException);
        });

        it('should throw InvalidContractStatusException when contract is not PENDING', async () => {
            // Arrange
            const contract = { status: ContractStatusEnum.APPROVED };
            repository.findById.mockResolvedValue(contract);

            // Act & Assert
            await expect(service.confirmContract('some-id'))
                .rejects
                .toThrow(InvalidContractStatusException);
        });

        it('should confirm contract when all validations pass', async () => {
            // Arrange
            const contractId = 'valid-id';
            const contract = { 
                contractId, 
                status: ContractStatusEnum.PENDING,
                orderId: 'order-1',
            };
            repository.findById.mockResolvedValue(contract);
            repository.save.mockResolvedValue({ ...contract, status: ContractStatusEnum.APPROVED });

            // Act
            const result = await service.confirmContract(contractId);

            // Assert
            expect(result.status).toBe(ContractStatusEnum.APPROVED);
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
                status: ContractStatusEnum.APPROVED,
            }));
        });
    });
});
```

#### Obrigação 4: Cobertura de Testes

- ✅ Testes unitários: **mínimo 80% de cobertura de linhas**
- ✅ Testes de service/repository: **obrigatório**
- ✅ Testes de controller: **recomendado (E2E)**
- ✅ Testes de exceções: **obrigatório — cada exceção deve ser testada**

**Verificar cobertura:**
```bash
npm run test:cov
```

#### Obrigação 5: Testes Falhando Antes de Implementação

**Workflow correto:**

```bash
# 1. Escrever teste que FALHA
npm run test -- --watch

# Você verá: ❌ FAIL src/modules/contract/services/contract.service.spec.ts
#   ● ContractService › confirmContract › should confirm contract when all validations pass
#     Expected: { status: 'APPROVED' }
#     Received: undefined (porque método não faz nada ainda)

# 2. Implementar para passar no teste
# (editar contract.service.ts)

# 3. Testes passam
npm run test

# Você verá: ✅ PASS src/modules/contract/services/contract.service.spec.ts
```

#### Obrigação 6: Refatoração Preserva Testes Verdes

```bash
# Após implementar funcionalidade:
npm run test              # Todos passam ✅
npm run test:cov          # Cobertura adequada ✅

# Refatore o código mantendo a interface pública
# Testes devem CONTINUAR passando
npm run test              # Ainda passam ✅
```

#### ⚠️ **Violação de TDD = Código Rejeitado**

- ❌ Não escrever testes antes da implementação → **REJEIÇÃO**
- ❌ Testes adicionados depois só "para passar" → **REJEIÇÃO**
- ❌ Cobertura abaixo de 80% → **REJEIÇÃO**
- ❌ Testes falhando/ignorados → **REJEIÇÃO**

---

## 5. Guia de Contribuição

### 5.1 Exemplo Prático: Adicionar Nova Funcionalidade com TDD

**Tarefa:** Implementar `rejectContract()` no serviço de contratos.

#### Passo 1: Entender a Regra de Negócio

- Apenas contratos em status PENDING podem ser rejeitados
- Deve registrar motivo da rejeição
- Status muda para REJECTED
- Atualizar timestamp

#### Passo 2: Escrever Testes Unitários (RED)

```typescript
// src/modules/contract/services/contract.service.spec.ts

describe('ContractService', () => {
    describe('rejectContract', () => {
        it('should throw ContractNotFoundException when contract does not exist', async () => {
            repository.findById.mockResolvedValue(null);

            await expect(service.rejectContract('invalid-id', 'Too expensive'))
                .rejects
                .toThrow(ContractNotFoundException);
        });

        it('should throw InvalidContractStatusException when contract is not PENDING', async () => {
            const contract = { status: ContractStatusEnum.APPROVED };
            repository.findById.mockResolvedValue(contract);

            await expect(service.rejectContract('id', 'reason'))
                .rejects
                .toThrow(InvalidContractStatusException);
        });

        it('should reject contract and save rejection reason', async () => {
            const contractId = 'contract-1';
            const reason = 'Too expensive';
            const contract = { 
                contractId, 
                status: ContractStatusEnum.PENDING,
                rejectionReason: null,
            };
            repository.findById.mockResolvedValue(contract);
            repository.save.mockResolvedValue({
                ...contract,
                status: ContractStatusEnum.REJECTED,
                rejectionReason: reason,
            });

            const result = await service.rejectContract(contractId, reason);

            expect(result.status).toBe(ContractStatusEnum.REJECTED);
            expect(result.rejectionReason).toBe(reason);
            expect(repository.save).toHaveBeenCalled();
        });
    });
});
```

**Resultado esperado:**
```
❌ FAIL: 3 failing
  - should throw ContractNotFoundException...
  - should throw InvalidContractStatusException...
  - should reject contract and save rejection reason...
```

#### Passo 3: Implementar para Passar nos Testes (GREEN)

```typescript
// src/modules/contract/services/contract.service.ts

@Injectable()
export class ContractService {
    async rejectContract(
        contractId: string,
        rejectionReason: string,
    ): Promise<ConfirmContractResponseDto> {
        const contract = await this.contractRepository.findById(contractId);
        
        if (!contract) {
            throw new ContractNotFoundException(contractId);
        }

        if (contract.status !== ContractStatusEnum.PENDING) {
            throw new InvalidContractStatusException(contract.status);
        }

        contract.status = ContractStatusEnum.REJECTED;
        contract.rejectionReason = rejectionReason;
        contract.updatedAt = new Date();

        return this.contractRepository.save(contract);
    }
}
```

**Resultado esperado:**
```
✅ PASS: 3 tests passed
```

#### Passo 4: Refatorar Mantendo Testes Verdes (REFACTOR)

```typescript
// Extrair validações para métodos reutilizáveis
private validateContractExists(contract: ContractEntity | null, contractId: string): void {
    if (!contract) {
        throw new ContractNotFoundException(contractId);
    }
}

private validateContractIsPending(contract: ContractEntity): void {
    if (contract.status !== ContractStatusEnum.PENDING) {
        throw new InvalidContractStatusException(contract.status);
    }
}

async rejectContract(
    contractId: string,
    rejectionReason: string,
): Promise<ConfirmContractResponseDto> {
    const contract = await this.contractRepository.findById(contractId);
    
    this.validateContractExists(contract, contractId);
    this.validateContractIsPending(contract!);

    contract!.status = ContractStatusEnum.REJECTED;
    contract!.rejectionReason = rejectionReason;
    contract!.updatedAt = new Date();

    return this.contractRepository.save(contract!);
}
```

**Resultado esperado:**
```
✅ PASS: 3 tests passed (mesmos testes)
```

### 5.2 Checklist de Qualidade Antes de Commit

- [ ] Todos os testes unitários passam: `npm run test`
- [ ] Cobertura de testes ≥ 80%: `npm run test:cov`
- [ ] ESLint sem erros: `npm run lint`
- [ ] Código formatado: `npm run format`
- [ ] Nenhuma exceção ignorada ou por fazer
- [ ] Repositórios usam injeção de dependência via tokens
- [ ] Exceptions são customizadas e específicas
- [ ] Novos módulos seguem estrutura: entities, repositories, services, controllers
- [ ] DTOs definidas para respostas HTTP

### 5.3 Scripts Úteis

```bash
# Executar testes unitários
npm run test

# Modo watch (reexecuta ao salvar)
npm run test:watch

# Gerar relatório de cobertura
npm run test:cov

# Linter com fix automático
npm run lint

# Formatar código
npm run format

# Compilar TypeScript
npm run build

# Iniciar aplicação em dev (watch mode)
npm run start:dev

# Debugar testes
npm run test:debug
```

---

## 6. Referências e Recursos

### 6.1 Documentação Oficial

- **NestJS:** https://docs.nestjs.com
- **TypeORM:** https://typeorm.io
- **Jest:** https://jestjs.io/docs/getting-started
- **TypeScript:** https://www.typescriptlang.org/docs

### 6.2 Padrões Arquiteturais

- **Domain-Driven Design (DDD):** Estruturação por contextos de negócio
- **Repository Pattern:** Abstração de acesso a dados
- **Dependency Injection:** Inversão de controle e testabilidade
- **Test-Driven Development (TDD):** Red-Green-Refactor

### 6.3 Estrutura do Projeto

```
freela-connect-dsc-2026-01/
├── freelaconnect-backend/          # Backend NestJS
│   ├── src/
│   │   ├── modules/               # Domínios de negócio
│   │   ├── common/                # Código compartilhado
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/                      # Testes E2E
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
├── docs/
│   ├── technical-documentation.md  # Este arquivo
│   ├── visao-geral.md             # Visão conceitual do projeto
│   └── README.md                  # Setup e fluxo git
│
├── .env.example                   # Template de variáveis
└── docker-compose.yml             # Banco de dados local
```

### 6.4 Próximos Passos

1. ✅ Revisar esta documentação
2. ✅ Executar `npm run test` para validar base
3. ✅ Seguir padrões em PRs futuras
4. ✅ Usar TDD em todas as features
5. ✅ Manter documentação atualizada

---

**Versão:** 1.0.0  
**Última atualização:** 2026-05-12  
**Mantido por:** Equipe Freela Connect
