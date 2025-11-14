export default function ContatosPage() {
  return (
    <div className="space-y-4 anim-fade-in">
      <h1 className="text-3xl font-bold anim-fade-up">Contatos</h1>
      <p className="text-gray-600 anim-fade-up anim-delay-1">Entraremos em contato com você!</p>
      <div className="brand-accent w-24" />
      <div className="bg-[#0d2a52] rounded-xl p-4 text-white grid md:grid-cols-2 gap-4 anim-fade-up anim-delay-2">
        <div className="space-y-2">
          <input className="w-full border rounded p-2 text-gray-900" placeholder="Seu nome *" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input className="w-full border rounded p-2 text-gray-900" placeholder="Telefone *" />
            <input className="w-full border rounded p-2 text-gray-900" placeholder="E-mail *" />
          </div>
          <textarea className="w-full border rounded p-2 text-gray-900" rows={4} placeholder="Mensagem (Opcional)" />
          <a href="/suporte" className="inline-flex items-center px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600">RECEBER CONTATO</a>
          <div className="pt-4 text-sm text-gray-200 flex items-center gap-4">
            <a className="underline" href="https://api.whatsapp.com/send?phone=554498236983" target="_blank" rel="noreferrer">WhatsApp</a>
            <a className="underline" href="https://www.instagram.com/bee.u.school/" target="_blank" rel="noreferrer">Instagram</a>
            <a className="underline" href="https://www.facebook.com/profile.php?id=100075049137637" target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
      </div>
    </div>
  );
}