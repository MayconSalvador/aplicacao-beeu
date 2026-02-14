import Card from "../components/ui/Card";

const API_BASE_SERVER = process.env.API_BASE_SERVER || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type Plan = {
  id: number;
  name: string;
  description: string;
  price: string | number;
};

async function fetchPlans(): Promise<Plan[]> {
  try {
    // Tenta buscar do backend (endpoint criado: /api/courses/plans/)
    const res = await fetch(`${API_BASE_SERVER}/api/courses/plans/`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch plans');
    const data = await res.json();
    return Array.isArray(data) ? data : (data.results || []);
  } catch (e) {
    console.error("Erro ao buscar planos, usando fallback:", e);
    // Dados estáticos de fallback conforme solicitado
    return [
      { id: 1, name: "Light", description: "1 x semanal", price: 0 },
      { id: 2, name: "Fit", description: "2 x semanal", price: 0 },
      { id: 3, name: "Intense", description: "3 x semanal", price: 0 },
      { id: 4, name: "Prime", description: "4 x semanal", price: 0 },
    ];
  }
}

export default async function CursosPage() {
  const plans = await fetchPlans();

  // Ordenar planos se necessário (Light -> Fit -> Intense -> Prime)
  const order = ["Light", "Fit", "Intense", "Prime"];
  const sortedPlans = [...plans].sort((a, b) => {
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Nossos Planos</h1>
        <p className="mt-3 text-gray-600">Escolha a frequência ideal para o seu aprendizado. Todos os planos incluem material didático e acesso à plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedPlans.map((plan) => (
          <Card key={plan.id} accent padding="lg" title={plan.name} className="h-full flex flex-col border-t-4 border-t-blue-900 hover:shadow-xl transition-shadow">
            <div className="flex-1">
              <div className="text-center py-6 bg-blue-50/50 rounded-xl mb-6">
                <span className="block text-2xl font-bold text-blue-900">{plan.description}</span>
                <span className="text-sm text-blue-600 font-medium uppercase tracking-wide">Aulas ao vivo</span>
              </div>
              
              <ul className="space-y-3 mb-6 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold text-lg leading-none">✓</span>
                  <span>Metodologia natural</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold text-lg leading-none">✓</span>
                  <span>Material digital incluso</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold text-lg leading-none">✓</span>
                  <span>Foco em conversação</span>
                </li>
                {plan.name === 'Prime' && (
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-500 font-bold text-lg leading-none">✓</span>
                    <span className="font-semibold text-blue-700">Imersão total</span>
                  </li>
                )}
              </ul>
            </div>
            
            <div className="mt-auto pt-6 border-t border-gray-100">
              <a 
                href={`https://api.whatsapp.com/send?phone=554498236983&text=Olá! Gostaria de saber mais sobre o plano ${plan.name} (${plan.description})`}
                target="_blank" 
                rel="noreferrer" 
                className="block w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-center rounded-lg font-bold uppercase text-sm tracking-wide transition-colors shadow-sm hover:shadow"
              >
                Quero este
              </a>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Dúvidas sobre qual escolher?</h2>
        <p className="text-gray-600 mb-6">Agende uma aula experimental gratuita e conheça nossa metodologia na prática.</p>
        <a href="/contatos" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Falar com consultor
        </a>
      </div>
    </div>
  );
}
