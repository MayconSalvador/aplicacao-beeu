import Card from "../components/ui/Card";

export default function SobrePage() {
  return (
    <div className="space-y-6 anim-fade-in">
      <h1 className="text-3xl font-bold anim-fade-up">Sobre a Bee U</h1>
      <div className="brand-accent w-16" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="lg" title="Nosso Grupo" className="anim-fade-up">
          <p className="text-gray-700 text-sm">A Bee U não apenas forma falantes, mas dominadores da língua, transformando o Inglês em segunda Língua Mãe. Ensinando de forma natural e imersiva, formamos falantes e não semi‑falantes.</p>
        </Card>
        <Card padding="lg" title="Professores" className="anim-fade-up anim-delay-1">
          <p className="text-gray-700 text-sm">Somos um grupo de professores que tirou o ensino e aprendizado do convencional, focando em eficiência e comunicação real.</p>
        </Card>
        <Card padding="lg" title="Aulas online" className="anim-fade-up anim-delay-2">
          <p className="text-gray-700 text-sm">Aulas online de sucesso, com flexibilidade de horários e foco em prática no conforto da sua rotina.</p>
        </Card>
      </div>
    </div>
  );
}