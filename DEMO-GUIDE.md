# 🚀 Guia de Demonstração - Contract & Payments API

## 📋 Conteúdo
1. [Inicialização](#inicialização)
2. [Demonstração de Contratos](#demonstração-de-contratos)
3. [Demonstração de Pagamentos](#demonstração-de-pagamentos)
4. [Controle de Versão (Optimistic Locking)](#controle-de-versão)
5. [Paginação](#paginação)

---

## Inicialização

### 1️⃣ Inicie o banco de dados
```bash
cd freelaconnect-backend
docker-compose up -d
```

### 2️⃣ Inicie a aplicação
```bash
cd freelaconnect-backend
npm run start:dev
```

Aguarde até ver: **[NestFactory] Application listening on port 3000**

---

## 📝 Demonstração de Contratos

### 1. Criar um Contrato (POST /contracts)

```bash
curl -X POST http://localhost:3000/contracts \
  -H "Content-Type: application/json" \
  -d '{
    "freelancerId": "freelancer-001",
    "orderId": "order-001",
    "projectId": "project-001",
    "status": "PENDING"
  }'
```

**Resposta esperada:**
```json
{
  "contractId": 1,
  "freelancerId": "freelancer-001",
  "orderId": "order-001",
  "projectId": "project-001",
  "status": "PENDING",
  "version": 1,
  "createdAt": "2026-06-01T15:37:53.123Z",
  "updatedAt": "2026-06-01T15:37:53.123Z",
  "deletedAt": null
}
```

**Guarde o `contractId` para os próximos passos! (ex: 1)**

---

### 2. Listar Contratos com Paginação (GET /contracts)

#### Sem parâmetros (usa padrão: page=1, limit=10)
```bash
curl http://localhost:3000/contracts
```

#### Com paginação customizada
```bash
curl "http://localhost:3000/contracts?page=1&limit=5"
```

**Resposta esperada:**
```json
{
  "data": [
    {
      "contractId": 1,
      "freelancerId": "freelancer-001",
      "orderId": "order-001",
      "projectId": "project-001",
      "status": "PENDING",
      "version": 1,
      "createdAt": "2026-06-01T15:37:53.123Z",
      "updatedAt": "2026-06-01T15:37:53.123Z",
      "deletedAt": null
    }
  ],
  "page": 1,
  "limit": 5,
  "total": 1,
  "totalPages": 1
}
```

---

### 3. Obter Contrato Específico (GET /contracts/:id)

```bash
curl http://localhost:3000/contracts/1
```

---

### 4. Atualizar Contrato (PATCH /contracts/:id)

⚠️ **IMPORTANTE**: Envie o `version` que você recebeu!

```bash
curl -X PATCH http://localhost:3000/contracts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS",
    "version": 1
  }'
```

**Resposta esperada (version incrementou para 2):**
```json
{
  "contractId": 1,
  "freelancerId": "freelancer-001",
  "orderId": "order-001",
  "projectId": "project-001",
  "status": "IN_PROGRESS",
  "version": 2,
  "createdAt": "2026-06-01T15:37:53.123Z",
  "updatedAt": "2026-06-01T15:37:58.456Z",
  "deletedAt": null
}
```

---

### 5. Substituir Contrato (PUT /contracts/:id)

```bash
curl -X PUT http://localhost:3000/contracts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "freelancerId": "freelancer-002",
    "orderId": "order-002",
    "projectId": "project-002",
    "status": "COMPLETED",
    "version": 2
  }'
```

---

### 6. Deletar Contrato (DELETE /contracts/:id)

⚠️ **IMPORTANTE**: Envie o `version` correto!

```bash
curl -X DELETE http://localhost:3000/contracts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "version": 2
  }'
```

**Resposta esperada:**
```json
{
  "message": "Contrato deletado com sucesso"
}
```

---

## 💳 Demonstração de Pagamentos

### 1. Criar um Pagamento (POST /payments)

```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "ordemId": "order-001",
    "status": "PENDING",
    "amount": 1500.50
  }'
```

**Resposta esperada:**
```json
{
  "paymentId": "550e8400-e29b-41d4-a716-446655440000",
  "ordemId": "order-001",
  "status": "PENDING",
  "amount": 1500.50,
  "version": 1,
  "paidAt": null,
  "createdAt": "2026-06-01T15:37:53.123Z",
  "updatedAt": "2026-06-01T15:37:53.123Z",
  "deletedAt": null
}
```

**Guarde o `paymentId`!**

---

### 2. Listar Pagamentos com Paginação (GET /payments)

```bash
curl "http://localhost:3000/payments?page=1&limit=10"
```

**Resposta esperada:**
```json
{
  "data": [
    {
      "paymentId": "550e8400-e29b-41d4-a716-446655440000",
      "ordemId": "order-001",
      "status": "PENDING",
      "amount": 1500.50,
      "version": 1,
      "paidAt": null,
      "createdAt": "2026-06-01T15:37:53.123Z",
      "updatedAt": "2026-06-01T15:37:53.123Z",
      "deletedAt": null
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1
}
```

---

### 3. Obter Pagamento por ID (GET /payments/:id)

```bash
curl http://localhost:3000/payments/550e8400-e29b-41d4-a716-446655440000
```

---

### 4. Obter Pagamento por Ordem (GET /payments/by-order/:ordemId)

```bash
curl http://localhost:3000/payments/by-order/order-001
```

---

### 5. Atualizar Pagamento (PATCH /payments/:id)

```bash
curl -X PATCH http://localhost:3000/payments/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "COMPLETED",
    "paidAt": "2026-06-01T15:37:53.123Z",
    "version": 1
  }'
```

**Resposta (version incrementou para 2):**
```json
{
  "paymentId": "550e8400-e29b-41d4-a716-446655440000",
  "ordemId": "order-001",
  "status": "COMPLETED",
  "amount": 1500.50,
  "version": 2,
  "paidAt": "2026-06-01T15:37:53.123Z",
  "createdAt": "2026-06-01T15:37:53.123Z",
  "updatedAt": "2026-06-01T15:37:58.456Z",
  "deletedAt": null
}
```

---

### 6. Substituir Pagamento (PUT /payments/:id)

```bash
curl -X PUT http://localhost:3000/payments/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "ordemId": "order-002",
    "status": "COMPLETED",
    "amount": 2000.00,
    "paidAt": "2026-06-01T15:37:53.123Z",
    "version": 2
  }'
```

---

### 7. Deletar Pagamento (DELETE /payments/:id)

```bash
curl -X DELETE http://localhost:3000/payments/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "version": 2
  }'
```

---

## 🔒 Controle de Versão (Optimistic Locking)

### Demonstrando Conflito de Versão (HTTP 409)

Este é o **recurso mais importante** a demonstrar!

#### 1. Crie um contrato
```bash
curl -X POST http://localhost:3000/contracts \
  -H "Content-Type: application/json" \
  -d '{
    "freelancerId": "freelancer-001",
    "orderId": "order-001",
    "projectId": "project-001",
    "status": "PENDING"
  }'
```

Resposta: `version: 1`

#### 2. Faça UPDATE 1 (com version correta)
```bash
curl -X PATCH http://localhost:3000/contracts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS",
    "version": 1
  }'
```

Resposta: `version: 2` ✅

#### 3. Tente fazer UPDATE 2 com version ERRADA (simula outro usuário que não viu a mudança)
```bash
curl -X PATCH http://localhost:3000/contracts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "COMPLETED",
    "version": 1
  }'
```

**Resposta esperada (ERRO 409):**
```json
{
  "statusCode": 409,
  "message": "Conflito de versão para contrato 1. Versão esperada: 1, versão atual: 2. O contrato foi modificado por outro usuário.",
  "error": "Conflict"
}
```

**O que isso significa:**
- Um usuário A atualizou o contrato (version 1 → 2)
- Usuário B tentou atualizar com version 1 (que já é obsoleta)
- Sistema detectou o conflito e rejeitou para **evitar sobrescrita acidental**
- Usuário B precisa recarregar os dados (agora com version 2) e tentar novamente

---

## 📊 Paginação

### Teste criando múltiplos registros

#### Criar 15 contratos
```bash
for i in {1..15}; do
  curl -X POST http://localhost:3000/contracts \
    -H "Content-Type: application/json" \
    -d "{
      \"freelancerId\": \"freelancer-$i\",
      \"orderId\": \"order-$i\",
      \"projectId\": \"project-$i\",
      \"status\": \"PENDING\"
    }"
done
```

#### Testar diferentes páginas (limit=5)

**Página 1:**
```bash
curl "http://localhost:3000/contracts?page=1&limit=5"
```

**Página 2:**
```bash
curl "http://localhost:3000/contracts?page=2&limit=5"
```

**Página 3:**
```bash
curl "http://localhost:3000/contracts?page=3&limit=5"
```

**Resposta exemplo (página 2):**
```json
{
  "data": [
    { "contractId": 6, "status": "PENDING", "version": 1, ... },
    { "contractId": 7, "status": "PENDING", "version": 1, ... },
    { "contractId": 8, "status": "PENDING", "version": 1, ... },
    { "contractId": 9, "status": "PENDING", "version": 1, ... },
    { "contractId": 10, "status": "PENDING", "version": 1, ... }
  ],
  "page": 2,
  "limit": 5,
  "total": 15,
  "totalPages": 3
}
```

---

## 🎯 Script Completo de Demonstração

Salve como `demo.sh` (Linux/Mac) ou `demo.ps1` (Windows):

### Windows PowerShell (`demo.ps1`)

```powershell
$BASE_URL = "http://localhost:3000"

# 1. Criar Contrato
Write-Host "=== 1. Criando Contrato ===" -ForegroundColor Green
$contract = curl -X POST "$BASE_URL/contracts" `
  -H "Content-Type: application/json" `
  -d @"{
    ""freelancerId"": ""freelancer-001"",
    ""orderId"": ""order-001"",
    ""projectId"": ""project-001"",
    ""status"": ""PENDING""
  }" | ConvertFrom-Json

$contractId = $contract.contractId
$version = $contract.version

Write-Host "Contrato criado! ID: $contractId, Version: $version" -ForegroundColor Cyan

# 2. Listar com Paginação
Write-Host "`n=== 2. Listando Contratos (Paginação) ===" -ForegroundColor Green
curl "$BASE_URL/contracts?page=1&limit=10"

# 3. Update com Version Correta
Write-Host "`n`n=== 3. Atualizando Contrato (Version Correta) ===" -ForegroundColor Green
$updated = curl -X PATCH "$BASE_URL/contracts/$contractId" `
  -H "Content-Type: application/json" `
  -d @"{
    ""status"": ""IN_PROGRESS"",
    ""version"": $version
  }" | ConvertFrom-Json

$newVersion = $updated.version
Write-Host "Contrato atualizado! Nova version: $newVersion" -ForegroundColor Cyan

# 4. Update com Version ERRADA (erro 409)
Write-Host "`n=== 4. Tentando Atualizar com Version ERRADA (esperado: erro 409) ===" -ForegroundColor Yellow
curl -X PATCH "$BASE_URL/contracts/$contractId" `
  -H "Content-Type: application/json" `
  -d @"{
    ""status"": ""COMPLETED"",
    ""version"": $version
  }"

Write-Host "`n`n✅ Demonstração Concluída!" -ForegroundColor Green
```

### Linux/Mac (`demo.sh`)

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

# 1. Criar Contrato
echo -e "\n\033[32m=== 1. Criando Contrato ===\033[0m"
response=$(curl -s -X POST "$BASE_URL/contracts" \
  -H "Content-Type: application/json" \
  -d '{
    "freelancerId": "freelancer-001",
    "orderId": "order-001",
    "projectId": "project-001",
    "status": "PENDING"
  }')

contractId=$(echo $response | jq -r '.contractId')
version=$(echo $response | jq -r '.version')

echo -e "\033[36mContrato criado! ID: $contractId, Version: $version\033[0m"

# 2. Listar com Paginação
echo -e "\n\033[32m=== 2. Listando Contratos (Paginação) ===\033[0m"
curl -s "$BASE_URL/contracts?page=1&limit=10" | jq '.'

# 3. Update com Version Correta
echo -e "\n\n\033[32m=== 3. Atualizando Contrato (Version Correta) ===\033[0m"
updated=$(curl -s -X PATCH "$BASE_URL/contracts/$contractId" \
  -H "Content-Type: application/json" \
  -d "{
    \"status\": \"IN_PROGRESS\",
    \"version\": $version
  }")

newVersion=$(echo $updated | jq -r '.version')
echo -e "\033[36mContrato atualizado! Nova version: $newVersion\033[0m"

# 4. Update com Version ERRADA
echo -e "\n\033[33m=== 4. Tentando Atualizar com Version ERRADA (esperado: erro 409) ===\033[0m"
curl -s -X PATCH "$BASE_URL/contracts/$contractId" \
  -H "Content-Type: application/json" \
  -d "{
    \"status\": \"COMPLETED\",
    \"version\": $version
  }" | jq '.'

echo -e "\n\n\033[32m✅ Demonstração Concluída!\033[0m"
```

---

## 📱 Alternativa: Usar Postman

1. **Importe a collection** (ou crie manualmente):
   - Base URL: `http://localhost:3000`
   - Métodos: GET, POST, PATCH, PUT, DELETE

2. **Crie requests para:**
   - `POST /contracts` - Create
   - `GET /contracts` - List com paginação
   - `GET /contracts/:id` - Get by ID
   - `PATCH /contracts/:id` - Update
   - `PUT /contracts/:id` - Replace
   - `DELETE /contracts/:id` - Delete

3. **Teste a versão:**
   - Update 1 com version 1 (sucesso)
   - Update 2 com version 1 (erro 409)
   - Update 3 com version 2 (sucesso)

---

## 🎬 Ordem Recomendada para Demonstração

### Ao vivo (5-10 minutos):

1. ✅ Listar Contratos (vazio)
2. ✅ **Criar 3 Contratos** - mostrar response com `version: 1`
3. ✅ Listar com Paginação (limit=2) - mostrar `total: 3, totalPages: 2`
4. ✅ **Atualizar 1 Contrato** - mostrar `version: 2`
5. ✅ **Tentar Atualizar com version errada** - mostrar erro `409 Conflict` ← **PONTO CHAVE!**
6. ✅ Atualizar com version correta - sucesso
7. ✅ Repetir os mesmos passos com **Payments** (UUID vs INT)

### Destaques:

🎯 **Controle de Versão (Optimistic Locking)** é o diferencial! Mostra robustez contra race conditions.

---

## 📚 Conceitos Chave a Explicar

| Conceito | Explicação | Exemplo |
|----------|-----------|---------|
| **Version** | Campo inteiro que incrementa a cada mudança | v1 → v2 → v3 |
| **Optimistic Locking** | Previne conflito validando version antes de update | Erro 409 se version desatualizada |
| **Paginação** | Retorna dados em páginas (page, limit, total, totalPages) | `?page=2&limit=5` |
| **Soft Delete** | Registros não são deletados, marcados com `deletedAt` | Queries filtram deletados |
| **409 Conflict** | HTTP code quando há conflito de versão | Múltiplos usuários na mesma entidade |

---

## 🐛 Troubleshooting

| Erro | Causa | Solução |
|------|-------|--------|
| `Connection refused` | Backend não está rodando | `npm run start:dev` |
| `404 Not Found` | Rota errada ou recurso não existe | Verifique URL e IDs |
| `400 Bad Request` | DTO inválido | Verifique campos obrigatórios |
| `409 Conflict` | Version desatualizada | Recarregue dados e use version correta |
| `500 Internal Server` | Erro no banco | Verifique logs do backend |

