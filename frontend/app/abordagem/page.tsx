export default function AbordagemPage() {
  return (
    <div className="space-y-4 anim-fade-in">
      <h1 className="text-3xl font-bold anim-fade-up">Nossa abordagem</h1>
      <p className="text-gray-700 anim-fade-up anim-delay-1">BeeUSchool</p>
      <div className="brand-accent w-16" />
      <p className="text-gray-700 leading-relaxed anim-fade-up anim-delay-2">A nossa abordagem traz resultados e forma falantes. Nossos alunos vão além da leitura: priorizamos fala e prática desde a primeira aula, formando speakers confiantes.</p>
      <a href="/cursos" className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 text-sm anim-fade-up anim-delay-3">Comece agora mesmo</a>
    </div>
  );
}