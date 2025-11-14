import Card from "../components/ui/Card";
import Image from "next/image";
import Avatar1 from "../img/avatar/andrew.png";
import Avatar2 from "../img/avatar/gabi.png";
import Avatar3 from "../img/avatar/bruno.png";

const TESTIMONIALS = [
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
];

export default function OpinioesPage() {
  return (
    <div className="space-y-6 anim-fade-in">
      <div>
        <h1 className="text-3xl font-bold anim-fade-up">Opiniões dos alunos</h1>
        <p className="text-gray-600 anim-fade-up anim-delay-1">Alunos com um nível ótimo em inglês</p>
        <div className="brand-accent w-16" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TESTIMONIALS.map((t, idx) => (
          <Card padding="lg" key={t.name} className={`anim-fade-up ${idx === 1 ? 'anim-delay-1' : idx === 2 ? 'anim-delay-2' : ''}`}>
            <div className="flex items-center gap-3">
              {(() => {
                const avatars = [Avatar1, Avatar2, Avatar3];
                const src = avatars[idx % avatars.length];
                return (
                  <Image src={src} alt={t.name} width={40} height={40} className="rounded-full" />
                );
              })()}
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-gray-600">{t.role}</p>
              </div>
            </div>
            <p className="mt-3 text-gray-700 text-sm leading-relaxed">“{t.text}”</p>
          </Card>
        ))}
      </div>
    </div>
  );
}