'use client';

import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export default function NavAuth() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    function fetchUser() {
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
        }
      } catch {
        setIsAuth(false);
      }
    }

    fetchUser();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'access') fetchUser();
    };
    const onFocus = () => fetchUser();
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  if (!isAuth) {
    return (
      <a href="/login" className="ml-2 inline-flex items-center px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold uppercase">
        Área do Professor
      </a>
    );
  }

  return (
    <div className="inline-flex items-center gap-4 relative">
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
              <p className="font-semibold">{user?.username || 'Professor'}</p>
              {user?.email && <p className="text-gray-600">{user.email}</p>}
              <p className="text-xs text-blue-600 mt-1 uppercase">{user?.role || ''}</p>
            </div>
            <div className="pt-2 border-t space-y-1 text-sm">
              <a className="block underline" href="http://localhost:8000/admin" target="_blank" rel="noopener noreferrer">Acessar Painel Admin</a>
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
    </div>
  );
}
