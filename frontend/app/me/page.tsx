'use client';

import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export default function MePage() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [ordersMessage, setOrdersMessage] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [enrollmentsError, setEnrollmentsError] = useState<string | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [showOnlyPedidos, setShowOnlyPedidos] = useState<boolean>(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);
  const [pwdErr, setPwdErr] = useState<string | null>(null);

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      setError('Você não está autenticado. Faça login.');
      return;
    }
    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${access}` }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Falha ao carregar perfil');
        return res.json();
      })
      .then(setUser)
      .catch((e) => setError(e.message));

    // Buscar pedidos do usuário
    fetch(`${API_BASE}/api/payments/orders/`, {
      headers: { Authorization: `Bearer ${access}` }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Falha ao carregar pedidos');
        return res.json();
      })
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((e) => setOrdersError(e.message));

    // Buscar matrículas (cursos ativos)
    fetch(`${API_BASE}/api/enrollments/`, {
      headers: { Authorization: `Bearer ${access}` }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Falha ao carregar cursos ativos');
        return res.json();
      })
      .then((data) => setEnrollments(Array.isArray(data) ? data : []))
      .catch((e) => setEnrollmentsError(e.message));
    // Definir exibição apenas de pedidos quando hash é #pedidos
    const updateHashView = () => {
      const h = typeof window !== 'undefined' ? window.location.hash : '';
      setShowOnlyPedidos(h === '#pedidos');
    };
    updateHashView();
    window.addEventListener('hashchange', updateHashView);
    return () => {
      window.removeEventListener('hashchange', updateHashView);
    };
  }, []);

  async function handleDeleteOrder(id: number) {
    setOrdersMessage(null);
    setOrdersError(null);
    try {
      const access = localStorage.getItem('access');
      if (!access) {
        setOrdersError('Você não está autenticado. Faça login.');
        return;
      }
      const res = await fetch(`${API_BASE}/api/payments/orders/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${access}` }
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Falha ao excluir pedido');
      }
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setOrdersMessage('Pedido excluído com sucesso.');
      setConfirmDeleteId(null);
      // notificar outros componentes (nav) para refazer contagem
      try { localStorage.setItem('ordersUpdated', String(Date.now())); } catch {}
    } catch (e: any) {
      setOrdersError(e.message || 'Erro ao excluir pedido');
    }
  }

  function formatBRL(amount: any) {
    const n = Number(amount);
    if (!Number.isFinite(n)) return String(amount);
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function statusBadgeClass(status: string) {
    switch (status) {
      case 'PAGA': return 'brand-badge badge-emerald';
      case 'CRIADA': return 'brand-badge badge-orange';
      case 'CANCELADA':
      case 'FALHOU':
      case 'ESTORNADA':
      default: return 'brand-badge badge-gray';
    }
  }

  function statusLabel(status: string) {
    switch (status) {
      case 'CRIADA': return 'Criada';
      case 'PAGA': return 'Paga';
      case 'FALHOU': return 'Falhou';
      case 'ESTORNADA': return 'Estornada';
      case 'CANCELADA': return 'Cancelada';
      default: return status;
    }
  }

  function getCheckoutUrl(ref: any): string | null {
    const s = typeof ref === 'string' ? ref : '';
    if (!s) return null;
    if (s.startsWith('http://') || s.startsWith('https://')) return s;
    return null;
  }

  async function submitDados(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaveMsg(null);
    try {
      const access = localStorage.getItem('access');
      if (!access) { setSaveMsg('Você precisa estar logado.'); return; }
      const fd = new FormData(e.currentTarget);
      const payload: any = {
        username: String(fd.get('username') || '').trim(),
        email: String(fd.get('email') || '').trim(),
        document_id: String(fd.get('document_id') || '').trim(),
        phone: String(fd.get('phone') || '').trim(),
        address: String(fd.get('address') || '').trim(),
      };
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${access}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || 'Falha ao salvar');
      setSaveMsg('Dados salvos com sucesso.');
      setUser(data);
    } catch (err: any) {
      setSaveMsg(err.message || 'Erro ao salvar');
    }
  }

  async function submitPrefs(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const access = localStorage.getItem('access');
      if (!access) { return; }
      const fd = new FormData(e.currentTarget);
      const preferences = {
        pref_news: fd.get('pref_news') ? true : false,
        pref_content_notifications: fd.get('pref_content_notifications') ? true : false,
      } as any;
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${access}` },
        body: JSON.stringify({ preferences }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Falha ao salvar preferências');
      }
      setSaveMsg('Preferências salvas.');
    } catch (err: any) {
      setSaveMsg(err.message || 'Erro ao salvar preferências');
    }
  }

  async function submitPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwdErr(null); setPwdMsg(null);
    try {
      const access = localStorage.getItem('access');
      if (!access) { setPwdErr('Você precisa estar logado.'); return; }
      const fd = new FormData(e.currentTarget);
      const old_password = String(fd.get('old_password') || '');
      const new_password = String(fd.get('new_password') || '');
      const confirm = String(fd.get('confirm') || '');
      if (new_password !== confirm) {
        setPwdErr('A confirmação não confere.');
        return;
      }
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${access}` },
        body: JSON.stringify({ old_password, new_password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || 'Falha ao alterar senha');
      setPwdMsg('Senha atualizada com sucesso.');
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err: any) {
      setPwdErr(err.message || 'Erro ao alterar senha');
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="brand-accent" />
      {!showOnlyPedidos && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Minha Conta</h1>
            {user && (
              <div className="relative">
                <button
                  type="button"
                  className="px-3 py-1 border rounded text-sm"
                  onClick={() => setIsInfoOpen((v) => !v)}
                  aria-expanded={isInfoOpen}
                  aria-controls="user-info-accordion"
                >
                  {user.username}
                </button>
                {isInfoOpen && (
                  <div
                    id="user-info-accordion"
                    className="absolute right-0 mt-2 w-64 border rounded bg-white shadow p-3 space-y-2 z-10"
                    role="region"
                    aria-label="Informações do usuário"
                  >
                    <p><span className="font-semibold">Usuário:</span> {user.username}</p>
                    <p><span className="font-semibold">Email:</span> {user.email}</p>
                    <p><span className="font-semibold">Role:</span> {user.role}</p>
                    <div className="pt-2 border-t">
                      <button
                        className="text-sm text-gray-700 underline"
                        onClick={() => { localStorage.removeItem('access'); localStorage.removeItem('refresh'); window.location.href = '/'; }}
                      >Sair</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {error && <p className="text-red-600">{error}</p>}

          <section className="space-y-3" id="dados">
            <h2 className="text-xl font-semibold">Meus dados</h2>
            {saveMsg && <p className="text-green-700 text-sm">{saveMsg}</p>}
            <form className="brand-card p-4" onSubmit={submitDados}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700">Nome</label>
                  <input name="username" className="w-full border rounded p-2" defaultValue={user?.username || ''} placeholder="Seu nome" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">E-mail</label>
                  <input name="email" type="email" className="w-full border rounded p-2" defaultValue={user?.email || ''} placeholder="voce@exemplo.com" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">CPF</label>
                  <input name="document_id" className="w-full border rounded p-2" placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Telefone</label>
                  <input name="phone" className="w-full border rounded p-2" placeholder="(00) 00000-0000" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700">Endereço</label>
                  <input name="address" className="w-full border rounded p-2" placeholder="Rua, número, complemento" />
                </div>
              </div>
              <div className="mt-3">
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Salvar</button>
              </div>
            </form>
          </section>

          <section className="space-y-3" id="config">
            <h2 className="text-xl font-semibold">Configurações</h2>
            <form className="brand-card p-4 text-sm text-gray-800" onSubmit={submitPrefs}>
              <label className="flex items-center gap-2">
                <input name="pref_news" type="checkbox" className="h-4 w-4" />
                Receber emails sobre novidades
              </label>
              <label className="flex items-center gap-2 mt-2">
                <input name="pref_content_notifications" type="checkbox" className="h-4 w-4" />
                Receber notificações de novos conteúdos
              </label>
              <div className="mt-3">
                <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">Salvar preferências</button>
              </div>
            </form>
          </section>

          <section className="space-y-3" id="senha">
            <h2 className="text-xl font-semibold">Alterar senha</h2>
            {pwdMsg && <p className="text-green-700 text-sm">{pwdMsg}</p>}
            {pwdErr && <p className="text-red-700 text-sm">{pwdErr}</p>}
            <form
              className="brand-card p-4 grid grid-cols-1 md:grid-cols-3 gap-3"
              onSubmit={submitPassword}
            >
              <div>
                <label className="block text-sm text-gray-700">Senha atual</label>
                <input name="old_password" type="password" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Nova senha</label>
                <input name="new_password" type="password" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Confirmar nova senha</label>
                <input name="confirm" type="password" className="w-full border rounded p-2" />
              </div>
              <div className="md:col-span-3">
                <button type="submit" className="px-4 py-2 rounded bg-emerald-600 text-white">Atualizar senha</button>
              </div>
            </form>
          </section>
          <section className="space-y-3" id="cursos-ativos">
            <h2 className="text-xl font-semibold">Meus cursos ativos</h2>
            {enrollmentsError && <p className="text-red-600 text-sm">{enrollmentsError}</p>}
            {!enrollmentsError && enrollments.length === 0 && (
              <p className="text-gray-600 text-sm">Você ainda não possui cursos ativos.</p>
            )}
            {enrollments.length > 0 && (
              <div className="space-y-3">
                {enrollments.map((en) => {
                  const course = en.course || {};
                  const paidOrders = orders.filter((o) => o.course && o.course.slug === course.slug && o.status === 'PAGA').length;
                  const dm = Number(course.duration_months);
                  const totalInstallments = Number.isFinite(dm) && dm > 0 ? dm : 6;
                  const paid = Math.min(paidOrders, totalInstallments);
                  const remaining = Math.max(totalInstallments - paid, 0);
                  return (
                    <div key={en.id} className="brand-card p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">
                            <a className="text-blue-600 underline" href={`/curso/${course.slug}`}>{course.title}</a>
                          </p>
                          <p className="text-xs text-gray-600">Status: {en.status}</p>
                        </div>
                        <div className="text-sm text-gray-700">Nível {course.level}</div>
                      </div>
                      <div className="mt-2 text-sm text-gray-800">
                        <p>Parcelas pagas: <span className="font-semibold">{paid}</span></p>
                        <p>Parcelas restantes: <span className="font-semibold">{remaining}</span> (plano de {totalInstallments} meses)</p>
                      </div>
                      {en.start_date && (
                        <p className="text-xs text-gray-500 mt-1">Início: {new Date(en.start_date).toLocaleDateString('pt-BR')}</p>
                      )}
                      {typeof en.progress === 'number' && (
                        <div className="mt-2">
                          <div className="h-2 bg-gray-200 rounded">
                            <div className="h-2 bg-emerald-600 rounded" style={{ width: `${Math.min(Math.max(en.progress, 0), 100)}%` }} />
                          </div>
                          <p className="text-xs text-gray-600 mt-1">Progresso: {en.progress}%</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
      <section className="space-y-3" id="pedidos">
        <h2 className="text-xl font-semibold">Meus pedidos</h2>
        {ordersMessage && <p className="text-green-700 text-sm">{ordersMessage}</p>}
        {ordersError && <p className="text-red-600 text-sm">{ordersError}</p>}
        {!ordersError && orders.length === 0 && (
          <p className="text-gray-600 text-sm">Você ainda não possui pedidos.</p>
        )}
        {orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((o) => {
              const course = o.course || {};
              return (
                <div key={o.id} className="brand-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        <a className="text-blue-600 underline" href={`/curso/${course.slug}`}>{course.title}</a>
                      </p>
                      <div className="mt-1 inline-flex items-center gap-2">
                        <span className={statusBadgeClass(o.status)}>{statusLabel(o.status)}</span>
                        <span className="text-xs text-gray-600">ID: {o.id}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">{formatBRL(o.amount)} • {o.currency}</div>
                  </div>
                  {o.created_at && (
                    <p className="text-xs text-gray-500 mt-1">Criado em: {new Date(o.created_at).toLocaleDateString('pt-BR')}</p>
                  )}
                  <div className="mt-3 text-sm text-gray-700">
                    <p>Provedor: <span className="font-semibold">{o.provider}</span></p>
                    {o.provider_ref && (
                      <p className="text-xs text-gray-600">Referência do provedor: {o.provider_ref}</p>
                    )}
                  </div>
                  {o.status !== 'PAGA' && (
                    <div className="mt-3 flex items-center gap-4">
                      <span className="text-xs text-orange-700">Aguardando pagamento</span>
                      <button
                        type="button"
                        className="px-2 py-1 text-xs border rounded text-red-700"
                        onClick={() => setConfirmDeleteId(o.id)}
                      >Excluir</button>
                      {getCheckoutUrl(o.provider_ref) && (
                        <a
                          href={getCheckoutUrl(o.provider_ref) as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 text-xs border rounded bg-emerald-600 text-white"
                        >Pagar agora</a>
                      )}
                      <a href={`/curso/${course.slug}`} className="px-2 py-1 text-xs border rounded text-blue-700">Ver curso</a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
      <div className="space-x-2">
        <a href="/cursos" className="text-blue-600 underline">Ver cursos</a>
        {!user && (
          <button
            className="text-sm text-gray-600 underline"
            onClick={() => { localStorage.removeItem('access'); localStorage.removeItem('refresh'); window.location.href = '/'; }}
          >Sair</button>
        )}
      </div>

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
          <div role="dialog" aria-modal="true" className="relative z-30 w-full max-w-sm brand-card p-4">
            <h3 className="text-lg font-semibold">Excluir pedido</h3>
            <p className="text-sm text-gray-700 mt-1">Deseja realmente excluir o pedido #{confirmDeleteId}? Esta ação é permanente.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-1 border rounded text-sm" onClick={() => setConfirmDeleteId(null)}>Cancelar</button>
              <button className="px-3 py-1 bg-red-600 text-white rounded text-sm" onClick={() => handleDeleteOrder(confirmDeleteId!)}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}