# Decisões de Projeto

## Defaults
- Locale: `pt-BR`, timezone: `America/Sao_Paulo`, moeda BRL.
- Autenticação: Django allauth + DRF SimpleJWT (JWT + refresh rotation), cookies HttpOnly/SameSite=Lax.
- RBAC: roles `ALUNO`, `PROFESSOR`, `STAFF`, `SUPERUSER` via grupo/role em `User`.
- Storage: MinIO com presigned URLs.
- Observabilidade: `/healthz` (FastAPI), métricas Prometheus em `/metrics`.
- Segurança: Rate limiting em rotas sensíveis, CORS estrito, validação (Zod/Pydantic), sanitização HTML.
- CI: lint (Ruff/Black, ESLint/Prettier), testes (pytest + coverage), build.

## Integrações de Pagamento
- Service Pattern: `PaymentService` com drivers Mercado Pago (PIX, boleto, cartão) e Stripe.
- Webhooks idempotentes; atualização de `Order.status`; geração automática de `Receipt`.

## Infra
- Docker Compose com serviços: `postgres`, `redis`, `minio`, `django`, `fastapi`, `frontend`.
- Rede interna entre serviços; volumes persistentes para banco e storage.

## Ambiguidades Assumidas
- Emails: SMTP externo configurável via env, entregue por Celery.
- Nginx: opcional em dev; produção usa reverse proxy gerenciado no provedor.