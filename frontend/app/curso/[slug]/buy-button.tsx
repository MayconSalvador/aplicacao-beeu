'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export default function BuyButton({ courseSlug }: { courseSlug: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setError(null);
    setMessage(null);
    const access = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
    if (!access) {
      window.location.href = '/login';
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/payments/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`,
        },
        body: JSON.stringify({ course_slug: courseSlug, provider: 'MERCADO_PAGO' }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Falha ao criar pedido');
      }
      const data = await res.json();
      setMessage(`Pedido ${data.id} criado. Status: ${data.status}.`);
      // Redirecionar imediatamente para a seção de pedidos (carrinho)
      if (typeof window !== 'undefined') {
        window.location.href = '/me#pedidos';
      }
      // TODO: redirecionar para página de checkout do provider quando provider_ref for implementado
    } catch (e: any) {
      setError(e.message || 'Erro ao criar pedido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleBuy}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Processando...' : 'Comprar'}
      </button>
      {message && (
        <div className="text-green-700 text-sm">
          <p>{message}</p>
          <a href="/me#pedidos" className="text-green-800 underline">Ver meus pedidos</a>
        </div>
      )}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}