# CI/CD do FreelaConnect

Este projeto usa uma esteira progressiva:

1. `CI`: valida frontend, backend, build das imagens Docker de producao e publica imagens no GitHub Container Registry em eventos controlados.
2. `Deploy`: executa deploy manual por SSH usando Docker Compose e GitHub Environments.

## Workflows

### CI

Arquivo: `.github/workflows/ci.yml`

Executa em `push`, `pull_request` e `workflow_dispatch`.

Validacoes principais:

- frontend: `npm ci`, `npm run lint:check`, `npm run build`
- backend: `pnpm install --frozen-lockfile`, `pnpm run lint:check`, testes unitarios, integracao, e2e e build
- Docker: valida `docker-compose.prod.yml`, construi as imagens produtivas e publica no GHCR quando o evento nao e `pull_request`

Em Pull Requests, o workflow apenas valida as imagens com `push: false`.

Em `push` para `main` ou `develop`, ou em execucao manual, o workflow publica:

- `ghcr.io/<owner>/<repo>-backend:latest`
- `ghcr.io/<owner>/<repo>-backend:<sha>`
- `ghcr.io/<owner>/<repo>-backend:<branch>`
- `ghcr.io/<owner>/<repo>-frontend:latest`
- `ghcr.io/<owner>/<repo>-frontend:<sha>`
- `ghcr.io/<owner>/<repo>-frontend:<branch>`

O workflow usa `GITHUB_TOKEN` com `packages: write`.

Variavel opcional de repositorio:

- `VITE_API_URL`: URL publica da API usada no build do frontend.

### Deploy

Arquivo: `.github/workflows/deploy.yml`

Executa manualmente com:

- environment: `staging` ou `production`
- image_tag: `latest`, nome da branch ou SHA do commit

Use GitHub Environments para separar secrets e exigir aprovacao manual em `production`.

Secrets esperados por environment:

- `SSH_HOST`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `SSH_PORT`
- `DEPLOY_PATH`
- `GHCR_USERNAME` opcional, se o pacote for privado
- `GHCR_TOKEN` opcional, se o pacote for privado

## Servidor

O servidor deve ter:

- Docker e Docker Compose instalados
- acesso SSH com usuario de deploy
- arquivo `docker-compose.prod.yml` no `DEPLOY_PATH`
- arquivo `.env` no `DEPLOY_PATH`

Exemplo de `.env` no servidor:

```env
DB_USERNAME=freelaconnect
DB_PASSWORD=change-me
DB_DATABASE=freelaconnect
JWT_SECRET=change-me
TYPEORM_SYNCHRONIZE=false
BACKEND_PORT=3002
FRONTEND_PORT=80
```

Antes de automatizar o deploy, rode manualmente no servidor:

```bash
docker compose -f docker-compose.prod.yml config
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
curl --fail http://localhost:3002/health
```

## Estrategia recomendada

Comece com Continuous Delivery:

- PRs precisam passar na CI.
- Push em `develop` ou `main` publica imagem rastreavel.
- Deploy em `staging` e `production` e iniciado manualmente.
- `production` deve exigir aprovacao manual pelo GitHub Environment.

Avance para Continuous Deployment somente depois de ter rollback, logs, backups e monitoramento basicos.
