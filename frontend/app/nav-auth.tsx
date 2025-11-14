'use client';

import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export default function NavAuth() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [ordersCount, setOrdersCount] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    function fetchOrders() {
      try {
        const access = localStorage.getItem('access');
        setIsAuth(!!access);
        if (access) {
          fetch(`${API_BASE}/api/auth/me`, {
            headers: { Authorization: `Bearer ${access}` }
          })
            .then(async (res) => {
              if (!res.ok) throw new Error('Falha ao carregar perfil');
              return res.json();
            })
            .then(setUser)
            .catch(() => setUser(null));
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
    <div className="inline-flex items-center gap-4 relative">
      {isAuth ? (
        <>
          <a href="/conteudos">Conteúdos</a>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              aria-expanded={isOpen}
              aria-controls="nav-user-menu"
              className="inline-flex items-center gap-2"
              title="Minha conta"
            >
              <FaUserCircle className="w-5 h-5" />
              <span className="sr-only">Minha Conta</span>
            </button>
            {isOpen && (
              <div
                id="nav-user-menu"
                className="absolute right-0 mt-2 w-64 border rounded bg-white text-gray-900 shadow p-3 space-y-2 z-20"
                role="menu"
                aria-label="Menu do usuário"
              >
                <div className="text-sm">
                  <p className="font-semibold">{user?.username || 'Usuário'}</p>
                  {user?.email && <p className="text-gray-600">{user.email}</p>}
                </div>
                <div className="pt-2 border-t space-y-1 text-sm">
                  <a className="block underline" href="/me#dados">Meus dados</a>
                  <a className="block underline" href="/me#config">Configurações</a>
                  <a className="block underline" href="/me#senha">Alterar senha</a>
                  <a className="block underline" href="/me#pedidos">Meus pedidos</a>
                </div>
                <div className="pt-2 border-t">
                  <button
                    className="text-sm text-gray-700 underline"
                    onClick={() => { localStorage.removeItem('access'); localStorage.removeItem('refresh'); window.location.href = '/'; }}
                  >Sair</button>
                </div>
              </div>
            )}
          </div>
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