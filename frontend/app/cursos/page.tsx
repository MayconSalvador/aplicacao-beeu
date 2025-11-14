const API_BASE_SERVER = process.env.API_BASE_SERVER || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function fetchCourses() {
  try {
    const res = await fetch(`${API_BASE_SERVER}/api/courses/`, { next: { revalidate: 60 } });
    return await res.json();
  } catch (e) {
    return [];
  }
}

export default async function CursosPage() {
  const courses = await fetchCourses();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Todos os cursos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    const CoursePlanInfo = require('../components/course/CoursePlanInfo').default;
                    return (
                      <CoursePlanInfo priceBr={c?.price_br} durationMonths={c?.duration_months} size="md" variant="blue" />
                    );
                  })()}
                </div>
              </Card>
            );
        })}
      </div>
    </div>
  );
}
import Card from "../components/ui/Card";