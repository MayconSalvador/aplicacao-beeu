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
      <section className="overflow-hidden anim-fade-in">
        <div className="relative bg-gradient-to-b from-[#0b1b34] to-[#0d2a52] text-white">
          <div className="p-10 md:p-16 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase anim-fade-up">INGLÊS SEM LIMITES</h1>
            <p className="mt-3 md:mt-4 text-lg md:text-xl opacity-90 anim-fade-up anim-delay-1">Há um mundo para se conquistar e a Bee U está aqui para te ajudar nessa conquista.</p>
            <div className="mt-6 anim-fade-up anim-delay-2">
              <a href="/cursos" className="inline-flex items-center px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 font-semibold uppercase">COMECE AGORA</a>
            </div>
          </div>
          <svg aria-hidden="true" viewBox="0 0 1440 140" preserveAspectRatio="none" className="w-full h-[80px] md:h-[120px] text-[#0d2a52]">
            <path fill="currentColor" d="M0,96L120,90.7C240,85,480,75,720,64C960,53,1200,43,1320,37.3L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path>
          </svg>
        </div>
      </section>

      <section className="space-y-6 anim-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card as="a" href="/sobre" padding="lg" title="Sobre nós" className="anim-fade-up">
            <p className="text-gray-700 text-sm">Conheça o nosso grupo, missão e a essência da Bee U.</p>
          </Card>
          <Card as="a" href="/abordagem" padding="lg" title="Nossa abordagem" className="anim-fade-up anim-delay-1">
            <p className="text-gray-700 text-sm">Ensino natural e imersivo, priorizando fala e prática desde o início.</p>
          </Card>
          <Card as="a" href="/professores" padding="lg" title="Professores" className="anim-fade-up anim-delay-2">
            <p className="text-gray-700 text-sm">O time que tornou o ensino mais eficiente e humano.</p>
          </Card>
        </div>
      </section>

      

      <section className="space-y-6 anim-fade-in">
        <div>
          <h2 className="text-2xl font-bold anim-fade-up">Depoimentos</h2>
          <p className="text-gray-600 anim-fade-up anim-delay-1">Algumas opiniões de alunos</p>
          <div className="brand-accent w-16" />
        </div>
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
            <Card padding="lg" key={t.name} className={`anim-fade-up ${idx === 1 ? 'anim-delay-1' : idx === 2 ? 'anim-delay-2' : ''}`}>
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

      

      <section className="anim-fade-in">
        <h2 className="text-2xl font-bold mb-4">Cursos em destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(courses || []).map((c: any, idx: number) => {
            const rawDesc = (c?.description || '').trim();
            const fallbackDesc = `Domine o nível ${c?.level} com prática guiada, materiais claros e acompanhamento humano.`;
            const descBase = rawDesc.length > 0 ? rawDesc : fallbackDesc;
            const desc = descBase.length > 160 ? `${descBase.slice(0, 157)}...` : descBase;
            return (
              <Card key={c?.slug || c?.id || idx} as="a" href={`/curso/${c.slug}`} accent padding="md" title={c.title} actions={<span className="brand-badge bg-gray-100 text-gray-700">Nível {c.level}</span>} className={`anim-fade-up ${idx % 2 === 1 ? 'anim-delay-1' : ''}`}>
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