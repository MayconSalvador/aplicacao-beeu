'use client';

import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export default function NavAuth() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [ordersCount, setOrdersCount] = useState<number>(0);

  useEffect(() => {
    function fetchOrders() {
      try {
        const access = localStorage.getItem('access');
        setIsAuth(!!access);
        if (access) {
          fetch(`${API_BASE}/api/payments/orders/`, {
            headers: { Authorization: `Bearer ${access}` }
          })
            .then(async (res) => {
              if (!res.ok) throw new Error('Falha ao carregar pedidos');
              return res.json();
            })
            .then((data) => {
              const arr = Array.isArray(data) ? data : [];
              setOrdersCount(arr.length);
            })
            .catch(() => setOrdersCount(0));
        } else {
          setOrdersCount(0);
        }
      } catch {
        setIsAuth(false);
        setOrdersCount(0);
      }
    }

    fetchOrders();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'ordersUpdated') fetchOrders();
      if (e.key === 'access') fetchOrders();
    };
    const onFocus = () => fetchOrders();
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return (
    <div className="inline-flex gap-4">
      {isAuth ? (
        <>
          <a href="/conteudos">Conteúdos</a>
          <a href="/me">Minha Conta</a>
          {ordersCount > 0 && (
            <a href="/me#pedidos" aria-label="Carrinho" title="Carrinho">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3 3h2l.4 2M7 13h10l3-8H5.4" />
                <circle cx="9" cy="19" r="2" />
                <circle cx="17" cy="19" r="2" />
              </svg>
            </a>
          )}
        </>
      ) : null}
    </div>
  );
}