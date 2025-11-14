import { notFound } from "next/navigation";

const API_BASE_SERVER = process.env.API_BASE_SERVER || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function fetchCourseBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE_SERVER}/api/courses/`, { next: { revalidate: 60 } });
    const data = await res.json();
    return (data || []).find((c: any) => c.slug === slug);
  } catch (e) {
    return null;
  }
}

export default async function CursoPage({ params }: { params: { slug: string } }) {
  const course = await fetchCourseBySlug(params.slug);
  if (!course) return notFound();

  return (
    <div className="space-y-4">
      <div className="brand-accent" />
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <span className="brand-badge bg-gray-100 text-gray-700">Nível {course.level}</span>
      </div>
      <p className="text-gray-700">R$ {course.price_br}</p>
      {(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const CoursePlanInfo = require('../../components/course/CoursePlanInfo').default;
        return (
          <CoursePlanInfo priceBr={course?.price_br} durationMonths={course?.duration_months} size="md" variant="blue" />
        );
      })()}
      <p className="leading-relaxed">{course.description}</p>
      <div className="flex flex-wrap gap-2 mt-1">
        <span className="brand-badge badge-red">Prática guiada</span>
        <span className="brand-badge badge-blue">Materiais inclusos</span>
        <span className="brand-badge badge-emerald">Acompanhamento humano</span>
      </div>

      {/* Comprar */}
      {/* eslint-disable-next-line @typescript-eslint/no-require-imports */}
      {(() => {
        const BuyButton = require('./buy-button').default;
        return <BuyButton courseSlug={params.slug} />;
      })()}

      {Array.isArray(course.modules) && course.modules.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Conteúdo do curso</h2>
          <div className="space-y-3">
            {course.modules.map((m: any) => (
              <div key={m.id} className="brand-card">
                <div className="brand-accent" />
                <div className="p-3">
                  <h3 className="font-semibold">{m.title}</h3>
                  <p className="text-sm text-gray-600">{m.summary}</p>
                  {Array.isArray(m.lessons) && m.lessons.length > 0 && (
                    <ul className="list-disc pl-5 mt-2">
                      {m.lessons.map((l: any) => (
                        <li key={l.id}>{l.title}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}