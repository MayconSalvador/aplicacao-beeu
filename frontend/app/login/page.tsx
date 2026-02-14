'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        throw new Error('Credenciais inválidas');
      }
      const data = await res.json();
      
      // Verify if user is professor or admin
      const meRes = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${data.access}` }
      });
      const userData = await meRes.json();
      
      if (userData.role !== 'PROFESSOR' && userData.role !== 'SUPERUSER' && userData.role !== 'STAFF') {
         throw new Error('Acesso restrito a professores.');
      }

      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      window.dispatchEvent(new Event('access')); // Notify other components
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="brand-accent mb-3" />
      <h1 className="text-2xl font-bold mb-2">Área do Professor</h1>
      <p className="text-gray-700 mb-4">Acesse para gerenciar seus alunos e agenda.</p>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg shadow-sm border">
        <div>
          <label className="block text-sm mb-1">Usuário</label>
          <input
            className="w-full border rounded p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Seu usuário"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Senha</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}