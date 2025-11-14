"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function isPasswordValid(pw: string) {
    // Min 8 chars, at least one digit and one special character
    const pattern = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return pattern.test(pw);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError("Usuário e senha são obrigatórios");
      return;
    }
    if (!isPasswordValid(password)) {
      setError("Senha deve ter pelo menos 8 caracteres, incluir número e caractere especial.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      let data: any = null;
      if (!res.ok) {
        // Tenta extrair mensagem amigável do backend
        try {
          data = await res.json();
          const msg = data?.detail || data?.message || "Falha no cadastro";
          throw new Error(msg);
        } catch {
          const txt = await res.text();
          throw new Error(txt || "Falha no cadastro");
        }
      } else {
        data = await res.json();
      }
      if (data?.access && data?.refresh) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
      }
      window.location.href = "/conteudos";
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="brand-accent mb-3" />
      <h1 className="text-2xl font-bold mb-2">Criar conta</h1>
      <p className="text-gray-700 mb-4">
        Crie sua conta para acessar os conteúdos e cursos da escola.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-sm mb-1">E-mail (opcional)</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Senha</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crie uma senha"
          />
          <p className="text-xs text-gray-600 mt-1">Mínimo 8 caracteres, com número e caractere especial.</p>
        </div>
        <div>
          <label className="block text-sm mb-1">Confirmar senha</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repita a senha"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Cadastrando..." : "Criar conta"}
        </button>
      </form>
    </div>
  );
}