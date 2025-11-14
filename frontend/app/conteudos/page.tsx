"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import CardClient from "../components/ui/CardClient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type ContentItem = {
  id: number;
  title: string;
  description?: string;
  type: "VIDEO" | "TEXTO" | "LINK";
  url: string;
  published_at?: string | null;
  audience?: "ALL" | "ALUNO" | "PROFESSOR";
  created_at: string;
  course?: { id: number; slug: string; title: string } | null;
};

function TypeBadge({ type }: { type: ContentItem["type"] }) {
  const mapClass: Record<ContentItem["type"], string> = {
    VIDEO: "badge-blue",
    TEXTO: "badge-emerald",
    LINK: "badge-purple",
  };
  const mapLabel: Record<ContentItem["type"], string> = {
    VIDEO: "Vídeo",
    TEXTO: "Texto",
    LINK: "Link",
  };
  return <span className={`brand-badge ${mapClass[type]}`}>{mapLabel[type]}</span>;
}

export default function ConteudosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [hasEnrollment, setHasEnrollment] = useState<boolean>(false);
  const [enrollCourseIds, setEnrollCourseIds] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [count, setCount] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [courseFilter, setCourseFilter] = useState<string>("");
  const [qDraft, setQDraft] = useState<string>("");
  const [q, setQ] = useState<string>("");
  const [playingIds, setPlayingIds] = useState<Set<number>>(new Set());
  const [courses, setCourses] = useState<Array<{ id: number; title: string; slug: string }>>([]);

  // Inicializa filtros a partir da query string
  useEffect(() => {
    const tp = searchParams.get("type") || "";
    const qp = searchParams.get("q") || "";
    const cp = searchParams.get("course") || "";
    const pg = parseInt(searchParams.get("page") || "1", 10);
    setTypeFilter(tp);
    setQ(qp);
    setQDraft(qp);
    setCourseFilter(cp);
    setPage(Number.isFinite(pg) && pg > 0 ? pg : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function load() {
      setError(null);
      setLoading(true);
      try {
        const access = localStorage.getItem("access");
        const logged = !!access;
        setIsLogged(logged);
        setNeedsLogin(!logged);
        let url = `${API_BASE}/api/content/items/?page=${page}&page_size=${pageSize}`;
        if (typeFilter) url += `&type=${encodeURIComponent(typeFilter)}`;
        if (q) url += `&q=${encodeURIComponent(q)}`;
        if (courseFilter) url += `&course=${encodeURIComponent(courseFilter)}`;
        const headers = logged ? { Authorization: `Bearer ${access}` } : undefined as any;
        const res = await fetch(url, { headers });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Falha ao carregar conteúdos");
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setItems(data);
          setCount(data.length);
          setHasNext(false);
          setHasPrevious(false);
        } else {
          setItems(Array.isArray(data.results) ? data.results : []);
          setCount(typeof data.count === 'number' ? data.count : 0);
          setHasNext(!!data.next);
          setHasPrevious(!!data.previous);
        }
      } catch (e: any) {
        setError(e.message || "Erro ao carregar conteúdos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, pageSize, typeFilter, q, courseFilter]);

  // Carrega matrículas quando logado para gatear acesso ao conteúdo
  useEffect(() => {
    async function loadEnrollments() {
      try {
        const access = localStorage.getItem("access");
        const logged = !!access;
        if (!logged) {
          setHasEnrollment(false);
          return;
        }
        const res = await fetch(`${API_BASE}/api/enrollments/`, {
          headers: { Authorization: `Bearer ${access}` },
        });
        if (!res.ok) {
          setHasEnrollment(false);
          return;
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : (Array.isArray(data.results) ? data.results : []);
        const activeEnrollments = list.filter((enr: any) => enr?.status === "ATIVA");
        setHasEnrollment(activeEnrollments.length > 0);
        const ids = new Set<number>();
        activeEnrollments.forEach((enr: any) => {
          const cid = enr?.course?.id;
          if (typeof cid === "number") ids.add(cid);
        });
        setEnrollCourseIds(ids);
      } catch {
        setHasEnrollment(false);
      }
    }
    loadEnrollments();
  }, [isLogged]);

  // Mantém filtros na query string para compartilhamento de URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (typeFilter) params.set("type", typeFilter);
    if (q) params.set("q", q);
    if (courseFilter) params.set("course", courseFilter);
    params.set("page", String(page));
    const qs = params.toString();
    router.replace(qs ? `/conteudos?${qs}` : "/conteudos", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, q, courseFilter, page]);

  // Carrega lista de cursos para filtro
  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch(`${API_BASE}/api/courses/`);
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : (Array.isArray(data.results) ? data.results : []);
        const parsed = list.map((c: any) => ({ id: c.id, title: c.title, slug: c.slug }));
        setCourses(parsed);
      } catch {}
    }
    loadCourses();
  }, []);

  function youtubeIdFromUrl(url: string): string | null {
    try {
      const u = new URL(url);
      // youtu.be/<id>
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.split("/").filter(Boolean)[0];
        return id || null;
      }
      // youtube.com/watch?v=<id>
      if (u.searchParams.get("v")) {
        return u.searchParams.get("v");
      }
      // youtube.com/embed/<id>
      if (u.pathname.includes("/embed/")) {
        const parts = u.pathname.split("/");
        const idx = parts.findIndex((p) => p === "embed");
        if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
      }
      return null;
    } catch {
      return null;
    }
  }

  function youtubeThumbnail(ytId: string): string {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Conteúdos</h1>
      <p className="text-gray-700">Vídeos, textos e links compartilhados pela escola.</p>

      {/* Banner de login no topo quando não logado */}
      {!isLogged && (
        <div className="rounded border border-blue-200 bg-blue-50 p-4 text-blue-800">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mt-0.5">
              <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
            </svg>
            <div>
              <p className="font-medium">Faça login para acessar os conteúdos.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href="/login" className="px-3 py-1 rounded bg-blue-600 text-white">Login</Link>
                <Link href="/register" className="px-3 py-1 rounded bg-gray-200 text-gray-900">Criar conta</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner para usuário logado sem matrícula ativa */}
      {isLogged && !hasEnrollment && (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mt-0.5">
              <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
            </svg>
            <div>
              <p className="font-medium">Você precisa estar matriculado em um curso para acessar os conteúdos.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href="/cursos" className="px-3 py-1 rounded bg-amber-600 text-white">Ver cursos</Link>
                <Link href="/me" className="px-3 py-1 rounded bg-gray-200 text-gray-900">Minha conta</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm text-gray-700">Tipo</label>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="border rounded px-2 py-1"
          >
            <option value="">Todos</option>
            <option value="VIDEO">Vídeo</option>
            <option value="TEXTO">Texto</option>
            <option value="LINK">Link</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700">Curso</label>
          <select
            value={courseFilter}
            onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}
            className="border rounded px-2 py-1 min-w-[180px]"
          >
            <option value="">Todos</option>
            {courses.map((c) => (
              <option key={c.id} value={c.slug}>{c.title}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[220px]">
          <label className="block text-sm text-gray-700">Busca</label>
          <input
            type="text"
            value={qDraft}
            onChange={(e) => setQDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { setQ(qDraft.trim()); setPage(1); } }}
            placeholder="Título ou descrição"
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setQ(qDraft.trim()); setPage(1); }}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Buscar
          </button>
          <button
            onClick={() => { setTypeFilter(""); setQDraft(""); setQ(""); setPage(1); }}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Loading skeleton (somente quando há carregamento real com token) */}
      {loading && !needsLogin && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="border rounded p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-5 w-12 rounded bg-gray-200" />
                <div className="h-5 flex-1 rounded bg-gray-200" />
              </div>
              <div className="mt-3 h-40 w-full rounded bg-gray-100" />
              <div className="mt-3 h-4 w-2/3 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-1/3 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      )}

      {/* Erros */}
      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Contadores de acesso (com base nos itens da página atual) */}
      {!loading && !error && items.length > 0 && (
        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
          {(() => {
            const accessible = items.filter((item) => {
              const requireCourse = !!item.course?.id;
              const canAccess = isLogged && ((requireCourse && enrollCourseIds.has(item.course!.id)) || (!requireCourse && hasEnrollment));
              return canAccess;
            }).length;
            const previews = items.length - accessible;
            return (
              <>
                <span className="rounded bg-green-50 text-green-800 px-2 py-1 border border-green-200">Conteúdos acessíveis: {accessible}</span>
                <span className="rounded bg-gray-50 text-gray-800 px-2 py-1 border border-gray-200">Prévias disponíveis: {previews}</span>
              </>
            );
          })()}
        </div>
      )}

      {!loading && !error && (
        items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => {
              const ytId = item.type === "VIDEO" ? youtubeIdFromUrl(item.url || "") : null;
              const actions = (
                <div className="inline-flex items-center gap-2">
                  <TypeBadge type={item.type} />
                  {(() => {
                    const requireCourse = !!item.course?.id;
                    const canAccess = isLogged && ((requireCourse && enrollCourseIds.has(item.course!.id)) || (!requireCourse && hasEnrollment));
                    return !canAccess;
                  })() && (
                    <span title="Conteúdo restrito a usuários matriculados" aria-label="Conteúdo restrito a usuários matriculados">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-700">
                        <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
                      </svg>
                    </span>
                  )}
                </div>
              );
              return (
                <CardClient key={item.id} padding="md" title={item.title} actions={actions}> 
                  <div className="flex flex-col gap-3">
                  {item.type === "VIDEO" && (
                    <div className="aspect-video w-full relative">
                      {(() => {
                        const requireCourse = !!item.course?.id;
                        const canAccess = isLogged && ((requireCourse && enrollCourseIds.has(item.course!.id)) || (!requireCourse && hasEnrollment));
                        return canAccess && ytId;
                      })() ? (
                        playingIds.has(item.id) ? (
                          <iframe
                            className="w-full h-full rounded"
                            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                            title={item.title}
                            aria-label={`Vídeo: ${item.title}`}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ) : (
                          <button
                            type="button"
                            className="w-full h-full"
                            onClick={() => {
                              const next = new Set(playingIds);
                              next.add(item.id);
                              setPlayingIds(next);
                            }}
                            aria-label={`Reproduzir vídeo: ${item.title}`}
                          >
                            <img
                              src={youtubeThumbnail(ytId)}
                              alt={`Thumbnail do vídeo: ${item.title}`}
                              className="w-full h-full object-cover rounded"
                              loading="lazy"
                            />
                            <span
                              className="absolute inset-0 flex items-center justify-center"
                              aria-hidden="true"
                            >
                              <span className="bg-black/50 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl">
                                ▶
                              </span>
                            </span>
                          </button>
                        )
                      ) : (
                        <div className="w-full h-full relative">
                          <div className="w-full h-full bg-gray-200 rounded" />
                          <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                            <span className="bg-black/50 text-white rounded-full w-14 h-14 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                                <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 116 0v3H9z" />
                              </svg>
                            </span>
                          </span>
                          <div className="absolute bottom-2 left-2 right-2 text-center">
                            <p className="text-xs text-white">Faça login e esteja matriculado no curso para reproduzir este vídeo.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-700">
                      {(() => {
                        const requireCourse = !!item.course?.id;
                        const canAccess = isLogged && ((requireCourse && enrollCourseIds.has(item.course!.id)) || (!requireCourse && hasEnrollment));
                        return canAccess ? item.description : (item.description.length > 160 ? `${item.description.slice(0, 157)}...` : item.description);
                      })()}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-3 flex-wrap">
                    {(() => {
                      const requireCourse = !!item.course?.id;
                      const canAccess = isLogged && ((requireCourse && enrollCourseIds.has(item.course!.id)) || (!requireCourse && hasEnrollment));
                      return canAccess && item.url;
                    })() ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline"
                      >
                        Abrir conteúdo
                      </a>
                    ) : (
                      <div className="text-sm text-gray-700">
                        {item.type === "LINK" ? (
                          <span>Conteúdo externo — faça login e esteja matriculado para acessar.</span>
                        ) : (
                          <span>Faça login e esteja matriculado para acessar o conteúdo.</span>
                        )}
                      </div>
                    )}
                    {item.course?.slug && (
                      (() => {
                        const canAccessCourse = isLogged && enrollCourseIds.has(item.course!.id);
                        if (canAccessCourse) return null;
                        return (
                          <Link href={`/curso/${item.course.slug}`} className="px-3 py-1 rounded bg-emerald-600 text-white">
                            Matricule-se
                          </Link>
                        );
                      })()
                    )}
                    {!item.course?.slug && (
                      <Link href="/cursos" className="px-3 py-1 rounded bg-emerald-600 text-white">
                        Matricule-se
                      </Link>
                    )}
                  </div>
                  </div>
                </CardClient>
              );
            })}
            <div className="flex items-center justify-between pt-4">
              <button
                disabled={!hasPrevious}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Anterior
              </button>
              <div className="text-sm text-gray-700">
                Página {page} • Total {count}
              </div>
              <button
                disabled={!hasNext}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Nenhum conteúdo disponível no momento.</p>
        )
      )}
    </div>
  );
}