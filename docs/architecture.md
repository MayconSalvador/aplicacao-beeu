# Arquitetura (Mermaid)

```mermaid
flowchart LR
  subgraph Client[Frontend Next.js]
    UI[UI/Pages]
    SDK[TypeScript SDK]
    UI --> SDK
  end

  subgraph Django[Backend Django/DRF]
    Auth[Auth (allauth + JWT)]
    Domain[Domínio: Users, Courses, Enrollments, Scheduling, Payments, Support]
    Admin[Admin]
    API[DRF API]
    Celery[Celery Worker]
    Auth --> API
    Domain --> API
    Domain --> Admin
    API --> Celery
  end

  subgraph FastAPI[Serviços FastAPI]
    Webhooks[Payments Webhooks]
    Reports[Reports]
    Notify[Notifications]
    Health[/healthz & /metrics]
  end

  DB[(PostgreSQL)]
  Cache[(Redis)]
  Storage[(MinIO S3)]

  Django --- DB
  Django --- Cache
  Django --- Storage

  FastAPI --- DB
  FastAPI --- Cache

  SDK --> API
  FastAPI --> Django
  Webhooks --> API
  Notify --> Celery
```

## Sequência de Pagamento

```mermaid
sequenceDiagram
  participant U as Usuário
  participant FE as Frontend
  participant DJ as Django API
  participant PS as Payment Provider
  participant FA as FastAPI Webhook

  U->>FE: Inicia checkout de Curso
  FE->>DJ: Cria Order (CRIADA)
  DJ->>PS: Cria preferência/intent (ref)
  U->>PS: Paga (PIX/Cartão)
  PS->>FA: Webhook (evento pago)
  FA->>DJ: Atualiza Order.status=PAGA
  DJ->>DJ: Gera Receipt
  DJ->>FE: Confirmação e acesso a materiais
```