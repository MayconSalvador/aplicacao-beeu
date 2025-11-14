export default function TrabalheConoscoPage() {
  return (
    <div className="space-y-4 anim-fade-in">
      <h1 className="text-3xl font-bold anim-fade-up">Trabalhe Conosco</h1>
      <div className="brand-accent w-16" />
      <section className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 anim-fade-up anim-delay-1">
        <h2 className="text-2xl font-bold">Torne-se um instrutor</h2>
        <p className="mt-2 text-white/90">Junte-se ao nosso time de instrutores e ajude nossos alunos a alcançar seus objetivos!</p>
        <div className="mt-4">
          <a href="/suporte" className="inline-flex items-center px-5 py-2 rounded bg-white/10 hover:bg-white/20">ENTRAR EM CONTATO</a>
        </div>
      </section>
    </div>
  );
}