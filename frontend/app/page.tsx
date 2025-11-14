import Card from "./components/ui/Card";
const API_BASE_SERVER = process.env.API_BASE_SERVER || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function fetchCourses() {
  try {
    const res = await fetch(`${API_BASE_SERVER}/api/courses/`, { next: { revalidate: 60 } });
    return await res.json();
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const courses = await fetchCourses();

  return (
    <div className="space-y-12">
      {/* Hero com identidade em vermelho/azul */}
      <section className="rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-blue-600 p-10 md:p-14 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Beeuschool</h1>
            <p className="mt-3 md:mt-4 text-lg md:text-xl opacity-90">
              Escola digital de inglês com foco em prática, materiais organizados e acompanhamento humano.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/cursos" className="inline-flex items-center px-4 py-2 rounded bg-white text-red-700 hover:bg-red-50 font-medium">
                Conheça os cursos
              </a>
              <a href="/conteudos" className="inline-flex items-center px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 font-medium">
                Ver conteúdos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Introdução curta */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Sobre a Beeuschool</h2>
        <p className="text-gray-700 leading-relaxed">
          Somos uma escola moderna que combina metodologia clara, prática orientada e tecnologia acessível.
          Nosso objetivo é tornar o aprendizado de inglês direto, motivador e aplicável no dia a dia.
        </p>
      </section>

      {/* Visão, Missão e Meta */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Nossa visão, missão e meta</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card padding="lg">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-red-600/90 text-white flex items-center justify-center font-bold">V</div>
              <h3 className="font-semibold">Visão</h3>
            </div>
            <p className="mt-2 text-gray-700 text-sm">
              Ser referência em ensino de inglês acessível, prático e orientado a resultados.
            </p>
          </Card>
          <Card padding="lg">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">M</div>
              <h3 className="font-semibold">Missão</h3>
            </div>
            <p className="mt-2 text-gray-700 text-sm">
              Guiar alunos em jornadas claras, com materiais objetivos e apoio contínuo.
            </p>
          </Card>
          <Card padding="lg">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-red-600/90 text-white flex items-center justify-center font-bold">G</div>
              <h3 className="font-semibold">Meta</h3>
            </div>
            <p className="mt-2 text-gray-700 text-sm">
              Construir confiança comunicativa: falar, entender e participar em inglês com segurança.
            </p>
          </Card>
        </div>
      </section>

      {/* Depoimentos fictícios */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Depoimentos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: "Ana Ribeiro",
              role: "Aluna A1",
              color: "bg-blue-600",
              text: "A plataforma é objetiva e as aulas são realmente práticas. Em poucas semanas, destravei meus primeiros diálogos!",
            },
            {
              name: "Carlos Mendes",
              role: "Aluno B1",
              color: "bg-red-600",
              text: "Gostei da clareza no plano de estudos e dos materiais. O suporte tirou minhas dúvidas rapidamente.",
            },
            {
              name: "Julia Santos",
              role: "Aluna A2",
              color: "bg-blue-700",
              text: "O foco em comunicação no dia a dia fez diferença. Estou mais confiante em reuniões e viagens.",
            },
          ].map((t, idx) => (
            <Card padding="lg" key={idx}>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full ${t.color} text-white flex items-center justify-center font-bold`}>
                  {t.name.split(' ')[0][0]}
                </div>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-gray-600">{t.role}</p>
                </div>
              </div>
              <p className="mt-3 text-gray-700 text-sm leading-relaxed">“{t.text}”</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Cursos em destaque (mantidos) */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Cursos em destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(courses || []).map((c: any) => {
            const rawDesc = (c?.description || '').trim();
            const fallbackDesc = `Domine o nível ${c?.level} com prática guiada, materiais claros e acompanhamento humano.`;
            const descBase = rawDesc.length > 0 ? rawDesc : fallbackDesc;
            const desc = descBase.length > 160 ? `${descBase.slice(0, 157)}...` : descBase;
            return (
              <Card as="a" href={`/curso/${c.slug}`} accent padding="md" title={c.title} actions={<span className="brand-badge bg-gray-100 text-gray-700">Nível {c.level}</span>}>
                <p className="text-sm text-gray-700 leading-relaxed">{desc}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="brand-badge badge-red">Prática guiada</span>
                  <span className="brand-badge badge-blue">Materiais inclusos</span>
                  <span className="brand-badge badge-emerald">Acompanhamento humano</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-gray-800">R$ {c.price_br}</p>
                  {(() => {
                    // eslint-disable-next-line @typescript-eslint/no-require-imports
                    const CoursePlanInfo = require('./components/course/CoursePlanInfo').default;
                    return (
                      <CoursePlanInfo priceBr={c?.price_br} durationMonths={c?.duration_months} size="md" variant="blue" />
                    );
                  })()}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}