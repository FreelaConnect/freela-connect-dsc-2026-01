# 🎥 COMO EXECUTAR AS DEMONSTRAÇÕES

## 📋 Pré-requisitos

1. **Docker rodando** com PostgreSQL
2. **Aplicação rodando** em http://localhost:3000

---

## 🚀 PASSO 1: Inicie o Banco de Dados

```bash
cd c:\Users\radam\freela-connect-dsc-2026-01\freelaconnect-backend
docker-compose up -d
```

Aguarde 10-15 segundos para o PostgreSQL ficar pronto.

---

## 🚀 PASSO 2: Inicie a Aplicação

Abra um terminal PowerShell e execute:

```bash
cd c:\Users\radam\freela-connect-dsc-2026-01\freelaconnect-backend
npm run start:dev
```

Aguarde até ver a mensagem:
```
[Nest] XXXX  - 06/01/2026, HH:MM:SS     LOG [NestFactory] Application listening on port 3000
```

---

## 🎬 PASSO 3: Execute a Demonstração

Abra um **NOVO terminal PowerShell** (sem fechar o anterior) e execute:

### Demonstração de CONTRATOS

```powershell
cd c:\Users\radam\freela-connect-dsc-2026-01
.\demo-contracts.ps1
```

**Duração:** ~30 segundos  
**Mostra:** Create, List, Pagination, Update, Version Conflict, Replace, Delete

### Demonstração de PAGAMENTOS

```powershell
cd c:\Users\radam\freela-connect-dsc-2026-01
.\demo-payments.ps1
```

**Duração:** ~30 segundos  
**Mostra:** Create, List, Pagination, Update, Version Conflict, Replace, Delete (com UUID)

---

## 🎯 O QUE CADA SCRIPT DEMONSTRA

### `demo-contracts.ps1`

```
1. ✅ Cria 3 contratos
2. ✅ Lista todos (paginação padrão)
3. ✅ Lista com limit customizado
4. ✅ Obtém detalhes de um contrato
5. ✅ Atualiza com version CORRETA → sucesso
6. ✅ Tenta atualizar com version ERRADA → ERRO 409! 🎯
7. ✅ Atualiza com version CORRETA → sucesso
8. ✅ Substitui contrato (PUT)
9. ✅ Deleta contrato
10. ✅ Mostra resumo e comparação
```

### `demo-payments.ps1`

```
1. ✅ Cria 3 pagamentos (com UUID!)
2. ✅ Lista com paginação
3. ✅ Busca por ordem (by-order)
4. ✅ Obtém detalhes
5. ✅ Atualiza com version CORRETA
6. ✅ Tenta atualizar com version ERRADA → ERRO 409! 🎯
7. ✅ Atualiza com version CORRETA
8. ✅ Substitui pagamento
9. ✅ Deleta pagamento
10. ✅ Compara Contratos vs Pagamentos
```

---

## 📊 O QUE OBSERVAR

### 🔴 Linha Mais Importante (Version Conflict)

Procure por esta parte:

```
❌ Erro 409 Conflict recebido (esperado!)
❌ Mensagem: Conflito de versão para contrato X. Versão esperada: 1, versão atual: 2...
✅ SUCESSO! Conflito de versão detectado e prevenido!
```

**Por que isso importa:**
- Previne race conditions
- Evita overwrites acidentais
- Garante integridade dos dados

---

## 🎥 DEMONSTRAÇÃO AO VIVO (5 minutos)

### Roteiro para apresentação:

```
1️⃣  Abra PowerShell na raiz do projeto
    cd c:\Users\radam\freela-connect-dsc-2026-01

2️⃣  Execute: .\demo-contracts.ps1
    [Mostre o output passo a passo]

3️⃣  Aguarde terminar, então execute: .\demo-payments.ps1
    [Mostre as similaridades entre os dois]

4️⃣  Aponte as diferenças:
    - Contratos usam INT sequencial
    - Pagamentos usam UUID
    - Ambos implementam Version Control identicamente

5️⃣  Destaque o erro 409:
    "Este é o recurso mais importante! Previne bugs!"
```

---

## 🔧 SOLUÇÃO DE PROBLEMAS

### ❌ "Connection refused on localhost:3000"
**Solução:** Verifique se a aplicação está rodando com `npm run start:dev`

### ❌ "Error: ECONNREFUSED - PostgreSQL"
**Solução:** Inicie o docker: `docker-compose up -d`

### ❌ "Script file cannot be loaded"
**Solução:** Execute no PowerShell como Administrador, ou:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ "HTTP 500 Internal Server Error"
**Solução:** Verifique os logs do backend no terminal

### ❌ "404 Not Found"
**Solução:** Verifique a URL e IDs dos recursos

---

## 📱 ALTERNATIVA: Usar com cURL Manualmente

Se preferir testar individual, use cURL:

### Criar um contrato
```bash
curl -X POST http://localhost:3000/contracts `
  -H "Content-Type: application/json" `
  -d '{
    "freelancerId": "freelancer-001",
    "orderId": "order-001",
    "projectId": "project-001",
    "status": "PENDING"
  }'
```

### Listar com paginação
```bash
curl "http://localhost:3000/contracts?page=1&limit=5"
```

### Atualizar (guarde o version!)
```bash
curl -X PATCH http://localhost:3000/contracts/1 `
  -H "Content-Type: application/json" `
  -d '{
    "status": "IN_PROGRESS",
    "version": 1
  }'
```

---

## 🎓 CONCEITOS A EXPLICAR

Enquanto executa os scripts, explique:

### 1. **Paginação**
"Veja a resposta: `page: 1, limit: 10, total: 3, totalPages: 1`
Quando temos 1000 registros, podemos fazer `?page=2&limit=100` para a próxima página."

### 2. **Controle de Versão (Optimistic Locking)**
"Cada contrato tem um `version`. Quando atualizamos, incrementa. Se outro usuário usar uma versão antiga, recebe erro 409."

### 3. **Conflito de Versão (409)**
"Veja: tentamos atualizar com version=1, mas o servidor estava em version=2.
Isso **previne bugs** onde 2 usuários tentam atualizar a mesma entidade!"

### 4. **Soft Delete**
"Não deletamos realmente, apenas marcamos com `deletedAt`.
Queries filtram automaticamente. Dados históricos são preservados."

---

## 📺 ESTRUTURA DE APRESENTAÇÃO (10 minutos)

```
0:00-1:00   Introdução ao projeto
1:00-4:00   Executar demo-contracts.ps1
4:00-6:00   Executar demo-payments.ps1
6:00-8:00   Explicar Controle de Versão e 409 Conflict
8:00-10:00  Explicar Paginação e Arquitetura
```

---

## 🎁 Arquivos Fornecidos

| Arquivo | Propósito |
|---------|-----------|
| `DEMO-GUIDE.md` | Guia completo com todos os comandos curl |
| `demo-contracts.ps1` | Script PowerShell para demonstração de contratos |
| `demo-payments.ps1` | Script PowerShell para demonstração de pagamentos |
| `COMO-EXECUTAR.md` | Este arquivo |

---

## ✅ Checklist Antes de Apresentar

- [ ] PostgreSQL rodando (`docker ps` mostra `freelaconnect-postgres`)
- [ ] Backend rodando em http://localhost:3000
- [ ] Scripts PowerShell no diretório correto
- [ ] Executar ExecutionPolicy se necessário
- [ ] Teste rápido: `curl http://localhost:3000` deve retornar "Hello World!"

---

## 🚀 Começar Agora

```powershell
# Terminal 1: Inicie o Docker
cd freelaconnect-backend
docker-compose up -d

# Terminal 2: Inicie a app
cd freelaconnect-backend
npm run start:dev

# Terminal 3: Execute a demo
cd ..
.\demo-contracts.ps1
```

Boa sorte na demonstração! 🎉
