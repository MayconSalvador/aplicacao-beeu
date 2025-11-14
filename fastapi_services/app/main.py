from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, PlainTextResponse
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST
import os

app = FastAPI(title="BeeU Integrations", version="1.0.0")

webhook_events_total = Counter("webhook_events_total", "Total de eventos de webhook recebidos", ["provider", "status"])


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


@app.get("/metrics")
def metrics():
    return PlainTextResponse(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/integrations/payments/webhook")
async def payments_webhook(request: Request):
    # Nota: validação de assinatura será implementada por provider e secret
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(400, detail="Invalid JSON")

    provider = payload.get("provider", "unknown")
    status = payload.get("status", "unknown")
    webhook_events_total.labels(provider=provider, status=status).inc()

    # Idempotência simplificada via provider_ref
    provider_ref = payload.get("provider_ref")
    order_status = payload.get("order_status")

    # TODO: validar assinatura (Mercado Pago/Stripe), conferir idempotência em cache/banco
    # Atualizar Django Order.status e criar Receipt via API interna
    django_url = os.environ.get("DJANGO_URL", "http://django:8000")

    # Exemplo de chamada (omitido por simplicidade); em produção usar httpx AsyncClient
    # await httpx.post(f"{django_url}/api/payments/webhook-sync", json=payload)

    return JSONResponse({"ok": True, "provider_ref": provider_ref, "order_status": order_status})