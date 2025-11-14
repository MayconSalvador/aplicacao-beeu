import Card from "../components/ui/Card";

const TEACHERS = [
  { name: "Philip Brower", title: "Teacher & IT Specialist" },
  { name: "Mariana Noe", title: "Event Speaker" },
  { name: "Gohan Lee", title: "Event Speaker" },
  { name: "Artem Mesh", title: "Online Teacher" },
];

export default function ProfessoresPage() {
  return (
    <div className="space-y-4 anim-fade-in">
      <h1 className="text-3xl font-bold anim-fade-up">The Teachers</h1>
      <p className="text-gray-600 anim-fade-up anim-delay-1">Melhores professores da nossa escola</p>
      <div className="brand-accent w-16" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {TEACHERS.map((t, idx) => (
          <Card key={t.name} padding="lg" title={t.name} subtitle={<span className="text-xs text-gray-600">{t.title}</span>} className={`anim-fade-up ${idx === 1 ? 'anim-delay-1' : idx === 2 ? 'anim-delay-2' : idx === 3 ? 'anim-delay-3' : ''}`}>
            <p className="text-sm text-gray-700">Bio breve do professor.</p>
          </Card>
        ))}
      </div>
    </div>
  );
}