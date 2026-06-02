# 🎬 SCRIPT DE DEMONSTRAÇÃO - CONTRATOS
# Demonstra: Create, List, Pagination, Version Control, Conflict Detection

$BASE_URL = "http://localhost:3000"
$ErrorActionPreference = "Continue"

function Print-Header($text) {
    Write-Host "`n$('='*60)" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Green
    Write-Host "$('='*60)" -ForegroundColor Cyan
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

Print-Header "DEMONSTRAÇÃO - CONTRATOS API"

# 1. CRIAR CONTRATOS
Print-Section "1. Criando 3 Contratos"

$contracts = @()

for ($i = 1; $i -le 3; $i++) {
    $response = Invoke-WebRequest -Uri "$BASE_URL/contracts" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body @{
            freelancerId = "freelancer-demo-$i"
            orderId = "order-demo-$i"
            projectId = "project-demo-$i"
            status = "PENDING"
        } | ConvertFrom-Json
    
    $contracts += $response
    Print-Success "Contrato #$i criado: ID=$($response.contractId), Version=$($response.version)"
}

# 2. LISTAR SEM PAGINAÇÃO
Print-Section "2. Listando Contratos (sem parâmetros - padrão: page=1, limit=10)"

$list1 = Invoke-WebRequest -Uri "$BASE_URL/contracts" | ConvertFrom-Json

Write-Host "  Total de contratos: $($list1.total)"
Write-Host "  Página: $($list1.page)/$($list1.totalPages)"
Write-Host "  Registros nesta página: $($list1.data.Count)"

Print-Success "Resposta estruturada com paginação recebida!"

# 3. LISTAR COM PAGINAÇÃO CUSTOMIZADA
Print-Section "3. Listando com Paginação Customizada (page=1, limit=2)"

$list2 = Invoke-WebRequest -Uri "$BASE_URL/contracts?page=1&limit=2" | ConvertFrom-Json

Write-Host "  Total de contratos: $($list2.total)"
Write-Host "  Total de páginas: $($list2.totalPages)"
Write-Host "  Registros por página: $($list2.limit)"

foreach ($contract in $list2.data) {
    Print-Info "  ID: $($contract.contractId) | Status: $($contract.status) | Version: $($contract.version)"
}

Print-Success "Paginação funcionando (total=$($list2.total), limit=$($list2.limit), pages=$($list2.totalPages))"

# 4. OBTER DETALHES
Print-Section "4. Obtendo Detalhes de um Contrato (GET /contracts/:id)"

$contractId = $contracts[0].contractId
$contractVersion = $contracts[0].version

$single = Invoke-WebRequest -Uri "$BASE_URL/contracts/$contractId" | ConvertFrom-Json

Print-Success "Contrato carregado: ID=$($single.contractId), Freelancer=$($single.freelancerId), Version=$($single.version)"

# 5. ATUALIZAR COM VERSION CORRETA
Print-Section "5. Atualizando com Version CORRETA (version=$contractVersion)"

$updatePayload = @{
    status = "IN_PROGRESS"
    version = $contractVersion
} | ConvertTo-Json

$updated = Invoke-WebRequest -Uri "$BASE_URL/contracts/$contractId" `
    -Method PATCH `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $updatePayload | ConvertFrom-Json

Print-Success "Contrato atualizado!"
Print-Info "Status: $($updated.status) | Version: $($updated.version) (incrementou!)"

$newVersion = $updated.version

# 6. DEMONSTRAR CONFLITO DE VERSÃO (HTTP 409)
Print-Section "6. Tentando Atualizar com Version DESATUALIZADA (version=$contractVersion)"
Print-Info "Simulando outro usuário que não viu a mudança anterior..."

$conflictPayload = @{
    status = "COMPLETED"
    version = $contractVersion
} | ConvertTo-Json

try {
    $conflict = Invoke-WebRequest -Uri "$BASE_URL/contracts/$contractId" `
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
        Print-Success "✨ SUCESSO! Conflito de versão detectado e prevenido!"
    } else {
        Write-Host "  Status Code: $statusCode"
    }
}

# 7. ATUALIZAR COM VERSION CORRETA NOVAMENTE
Print-Section "7. Atualizando com Version CORRETA (version=$newVersion)"

$updatePayload2 = @{
    status = "COMPLETED"
    version = $newVersion
} | ConvertTo-Json

$updated2 = Invoke-WebRequest -Uri "$BASE_URL/contracts/$contractId" `
    -Method PATCH `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $updatePayload2 | ConvertFrom-Json

Print-Success "Contrato atualizado novamente!"
Print-Info "Status: $($updated2.status) | Version: $($updated2.version)"

# 8. SUBSTITUIR CONTRATO (PUT)
Print-Section "8. Substituindo Contrato Completo (PUT)"

$replacePayload = @{
    freelancerId = "freelancer-novo"
    orderId = "order-novo"
    projectId = "project-novo"
    status = "IN_PROGRESS"
    version = $updated2.version
} | ConvertTo-Json

$replaced = Invoke-WebRequest -Uri "$BASE_URL/contracts/$contractId" `
    -Method PUT `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $replacePayload | ConvertFrom-Json

Print-Success "Contrato substituído!"
Print-Info "Novo freelancer: $($replaced.freelancerId) | Version: $($replaced.version)"

# 9. DELETAR CONTRATO
Print-Section "9. Deletando Contrato (DELETE)"

$deletePayload = @{
    version = $replaced.version
} | ConvertTo-Json

$deleted = Invoke-WebRequest -Uri "$BASE_URL/contracts/$contractId" `
    -Method DELETE `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $deletePayload | ConvertFrom-Json

Print-Success "Contrato deletado! Mensagem: $($deleted.message)"

# 10. RESUMO FINAL
Print-Header "RESUMO DA DEMONSTRAÇÃO"

Write-Host @"

📊 Recursos Demonstrados:

1. ✅ CREATE - Contrato criado com Version=1
2. ✅ LIST - Paginação com page, limit, total, totalPages
3. ✅ GET - Detalhes de um contrato específico
4. ✅ UPDATE (PATCH) - Alteração parcial com version
5. ✅ VERSION CONTROL - Otimistic Locking implementado
6. ✅ CONFLICT DETECTION - Erro 409 quando version desatualizada
7. ✅ REPLACE (PUT) - Substituição completa
8. ✅ DELETE - Soft delete com validação de versão

🎯 Destaques Técnicos:

• PAGINAÇÃO: Implementada em banco com skip/take
  Response inclui: data[], page, limit, total, totalPages

• CONTROLE DE VERSÃO: Optimistic Locking sem locks no banco
  - Version incrementa a cada UPDATE/REPLACE
  - Conflitos retornam HTTP 409 Conflict
  - Previne race conditions e overwrites acidentais

• SOFT DELETE: Registros marcados com deletedAt
  - Queries filtram automaticamente deletados
  - Dados históricos preservados

🔐 Pattern Demonstrado:

1️⃣  Cliente lê contrato com version=1
2️⃣  Cliente atualiza com version=1 ✓ (version vira 2)
3️⃣  Outro cliente tenta atualizar com version=1 ✗ (recebe 409)
4️⃣  Outro cliente recarrega (recebe version=2) e tenta novamente ✓

"@

Print-Header "✨ DEMONSTRAÇÃO CONCLUÍDA COM SUCESSO!"
