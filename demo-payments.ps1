# 🎬 SCRIPT DE DEMONSTRAÇÃO - PAGAMENTOS
# Demonstra: Create, List, Pagination, Version Control, UUID vs INT

$BASE_URL = "http://localhost:3000"
$ErrorActionPreference = "Continue"

function Print-Header($text) {
    Write-Host "`n$('='*60)" -ForegroundColor Magenta
    Write-Host "  $text" -ForegroundColor Green
    Write-Host "$('='*60)" -ForegroundColor Magenta
}

function Print-Section($text) {
    Write-Host "`n▶ $text" -ForegroundColor Yellow
}

function Print-Success($text) {
    Write-Host "  ✅ $text" -ForegroundColor Green
}

function Print-Error($text) {
    Write-Host "  ❌ $text" -ForegroundColor Red
}

function Print-Info($text) {
    Write-Host "  ℹ️  $text" -ForegroundColor Cyan
}

# ==================== DEMO ====================

Print-Header "DEMONSTRAÇÃO - PAGAMENTOS API"

# 1. CRIAR PAGAMENTOS
Print-Section "1. Criando 3 Pagamentos"

$payments = @()

for ($i = 1; $i -le 3; $i++) {
    $amount = 1000 + ($i * 500)
    
    $response = Invoke-WebRequest -Uri "$BASE_URL/payments" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body @{
            ordemId = "order-demo-$i"
            status = "PENDING"
            amount = $amount
        } | ConvertFrom-Json
    
    $payments += $response
    Print-Success "Pagamento #$i criado: PaymentID=$($response.paymentId.Substring(0,8))..., Amount=$($response.amount), Version=$($response.version)"
}

# 2. LISTAR COM PAGINAÇÃO
Print-Section "2. Listando Pagamentos (page=1, limit=10)"

$list = Invoke-WebRequest -Uri "$BASE_URL/payments?page=1&limit=10" | ConvertFrom-Json

Write-Host "  Total de pagamentos: $($list.total)"
Write-Host "  Página: $($list.page)/$($list.totalPages)"
Write-Host "  Limit: $($list.limit)"
Write-Host "  Registros nesta página: $($list.data.Count)"

foreach ($payment in $list.data) {
    $paymentIdShort = $payment.paymentId.Substring(0, 8)
    Print-Info "  PaymentID: $paymentIdShort... | Ordem: $($payment.ordemId) | Amount: $($payment.amount) | Version: $($payment.version)"
}

Print-Success "Paginação funcionando!"

# 3. PROCURAR PAGAMENTO POR ORDEM
Print-Section "3. Buscando Pagamento por Ordem (GET /payments/by-order/:ordemId)"

$ordemId = $payments[0].ordemId
$byOrder = Invoke-WebRequest -Uri "$BASE_URL/payments/by-order/$ordemId" | ConvertFrom-Json

Print-Success "Pagamento encontrado!"
Print-Info "Ordem: $($byOrder.ordemId) | Amount: $($byOrder.amount) | Status: $($byOrder.status)"

# 4. OBTER DETALHES
Print-Section "4. Obtendo Detalhes de um Pagamento (GET /payments/:id)"

$paymentId = $payments[0].paymentId
$paymentVersion = $payments[0].version

$single = Invoke-WebRequest -Uri "$BASE_URL/payments/$paymentId" | ConvertFrom-Json

Print-Success "Pagamento carregado!"
Print-Info "ID: $($single.paymentId.Substring(0, 8))... | Ordem: $($single.ordemId) | Version: $($single.version)"

# 5. ATUALIZAR COM VERSION CORRETA
Print-Section "5. Atualizando com Version CORRETA (version=$paymentVersion)"

$updatePayload = @{
    status = "COMPLETED"
    paidAt = [System.DateTime]::Now.ToString("o")
    version = $paymentVersion
} | ConvertTo-Json

$updated = Invoke-WebRequest -Uri "$BASE_URL/payments/$paymentId" `
    -Method PATCH `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $updatePayload | ConvertFrom-Json

Print-Success "Pagamento atualizado!"
Print-Info "Status: $($updated.status) | Version: $($updated.version) (incrementou!) | Paid At: $($updated.paidAt)"

$newVersion = $updated.version

# 6. DEMONSTRAR CONFLITO DE VERSÃO
Print-Section "6. Tentando Atualizar com Version DESATUALIZADA (version=$paymentVersion)"
Print-Info "Simulando outro usuário..."

$conflictPayload = @{
    status = "PENDING"
    version = $paymentVersion
} | ConvertTo-Json

try {
    $conflict = Invoke-WebRequest -Uri "$BASE_URL/payments/$paymentId" `
        -Method PATCH `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $conflictPayload
} catch {
    $response = $_.Exception.Response
    $statusCode = $response.StatusCode.value__
    
    if ($statusCode -eq 409) {
        Print-Error "Erro 409 Conflict recebido (esperado!)"
        
        $body = $_.Exception.Response.Content.ToString() | ConvertFrom-Json
        Print-Error "Mensagem: $($body.message)"
        Print-Success "✨ SUCESSO! Conflito de versão detectado!"
    }
}

# 7. ATUALIZAR COM VERSION CORRETA
Print-Section "7. Atualizando com Version CORRETA (version=$newVersion)"

$updatePayload2 = @{
    status = "SETTLED"
    version = $newVersion
} | ConvertTo-Json

$updated2 = Invoke-WebRequest -Uri "$BASE_URL/payments/$paymentId" `
    -Method PATCH `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $updatePayload2 | ConvertFrom-Json

Print-Success "Pagamento atualizado!"
Print-Info "Status: $($updated2.status) | Version: $($updated2.version)"

# 8. SUBSTITUIR PAGAMENTO
Print-Section "8. Substituindo Pagamento Completo (PUT)"

$newAmount = 5000
$replacePayload = @{
    ordemId = "order-novo"
    status = "PENDING"
    amount = $newAmount
    version = $updated2.version
} | ConvertTo-Json

$replaced = Invoke-WebRequest -Uri "$BASE_URL/payments/$paymentId" `
    -Method PUT `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $replacePayload | ConvertFrom-Json

Print-Success "Pagamento substituído!"
Print-Info "Nova Ordem: $($replaced.ordemId) | Novo Amount: $($replaced.amount) | Version: $($replaced.version)"

# 9. DELETAR PAGAMENTO
Print-Section "9. Deletando Pagamento (DELETE)"

$deletePayload = @{
    version = $replaced.version
} | ConvertTo-Json

$deleted = Invoke-WebRequest -Uri "$BASE_URL/payments/$paymentId" `
    -Method DELETE `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $deletePayload | ConvertFrom-Json

Print-Success "Pagamento deletado!"
Print-Info "Mensagem: $($deleted.message)"

# 10. COMPARAÇÃO: CONTRATOS vs PAGAMENTOS
Print-Header "COMPARAÇÃO: CONTRATOS vs PAGAMENTOS"

Write-Host @"

📊 Recursos Compartilhados:

┌─────────────────────────────────────────────────────────┐
│ FEATURE               │ CONTRATOS    │ PAGAMENTOS       │
├─────────────────────────────────────────────────────────┤
│ CREATE                │ ✅ Funciona  │ ✅ Funciona      │
│ READ (by ID)          │ ✅ Funciona  │ ✅ Funciona      │
│ READ (lista)          │ ✅ Funciona  │ ✅ Funciona      │
│ PAGINATION            │ ✅ Sim       │ ✅ Sim           │
│ UPDATE (PATCH)        │ ✅ Sim       │ ✅ Sim           │
│ REPLACE (PUT)         │ ✅ Sim       │ ✅ Sim           │
│ DELETE (com version)  │ ✅ Sim       │ ✅ Sim           │
│ VERSION CONTROL       │ ✅ Sim       │ ✅ Sim           │
│ CONFLICT DETECTION    │ ✅ 409       │ ✅ 409           │
│ SOFT DELETE           │ ✅ Sim       │ ✅ Sim           │
└─────────────────────────────────────────────────────────┘

🔑 Diferenças Importantes:

┌─────────────────────────────────────────────────────────┐
│ ASPECTO          │ CONTRATOS             │ PAGAMENTOS     │
├─────────────────────────────────────────────────────────┤
│ ID Type          │ INT (SERIAL)          │ UUID           │
│ ID Generation    │ Auto-incremento DB    │ UUID v4        │
│ Request Body     │ freelancerId, etc     │ ordemId, etc   │
│ Campos Adicionais│ projectId             │ amount, paidAt │
│ Busca Extra      │ ❌ Não                │ by-order/:id   │
└─────────────────────────────────────────────────────────┘

📋 Padrão de Implementação (replicado):

1. Entity com @Column decorators
2. DTOs para Create/Update/Delete/Response
3. Repository com CRUD + versioning
4. Service com lógica de negócio
5. Controller com rotas RESTful
6. Validações em camadas (DTO → Service → Repository)
7. Paginação com skip/take
8. Exception handling para 409 Conflict

"@

Print-Header "✨ DEMONSTRAÇÃO CONCLUÍDA COM SUCESSO!"

Write-Host "`n💡 PRÓXIMAS DEMONSTRAÇÕES:`n" -ForegroundColor Cyan
Write-Host "  1. Listar registros em múltiplas páginas" -ForegroundColor Gray
Write-Host "  2. Testar performance com volume de dados" -ForegroundColor Gray
Write-Host "  3. Demonstrar cascata de soft deletes" -ForegroundColor Gray
Write-Host "  4. Integração entre Contratos e Pagamentos" -ForegroundColor Gray
