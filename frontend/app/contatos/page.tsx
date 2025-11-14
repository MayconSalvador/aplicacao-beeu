import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Card from "../components/ui/Card";
import Image from "next/image";
import ContactImg from "../img/form.jpg";

export default function ContatosPage() {
  return (
    <div className="space-y-6 anim-fade-in">
      <div>
        <h1 className="text-3xl font-bold anim-fade-up">Contatos</h1>
        <p className="text-gray-600 anim-fade-up anim-delay-1">Entraremos em contato com você</p>
        <div className="brand-accent w-24" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 anim-fade-up anim-delay-2">
        <div className="lg:col-span-2 space-y-5">
          <Card padding="lg" title="Fale com a Bee U" subtitle={
            <span className="text-gray-600">Responderemos em até 1 dia útil</span>
          }>
            <form className="space-y-3" noValidate>
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Seu nome</label>
                <input id="nome" name="nome" required className="mt-1 w-full border rounded p-2 outline-none focus:ring-2 focus:ring-blue-600" placeholder="Ex.: Maria Souza" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
                  <input id="telefone" name="telefone" required className="mt-1 w-full border rounded p-2 outline-none focus:ring-2 focus:ring-blue-600" placeholder="(44) 9 9999-9999" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                  <input id="email" name="email" type="email" required className="mt-1 w-full border rounded p-2 outline-none focus:ring-2 focus:ring-blue-600" placeholder="voce@exemplo.com" />
                </div>
              </div>
              <div>
                <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700">Mensagem</label>
                <textarea id="mensagem" name="mensagem" rows={4} className="mt-1 w-full border rounded p-2 outline-none focus:ring-2 focus:ring-blue-600" placeholder="Como podemos ajudar? (opcional)" />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button type="button" className="inline-flex items-center px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white">Enviar mensagem</button>
                <a href="/suporte" className="text-sm underline text-gray-700">Precisa de suporte?</a>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-5">
          <Card padding="lg" title="Informações">
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-semibold">Telefone:</span> <a className="text-blue-600 underline" href="tel:+554498236983">+55 44 9823-6983</a></p>
              <p><span className="font-semibold">E-mail:</span> <a className="text-blue-600 underline" href="mailto:contato@beeuschool.com.br">contato@beeuschool.com.br</a></p>
              <div className="pt-2 flex items-center gap-4">
                <a className="inline-flex items-center gap-2 underline" href="https://api.whatsapp.com/send?phone=554498236983" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#25D366] text-white"><FaWhatsapp className="w-4 h-4" aria-hidden /></span>
                  WhatsApp
                </a>
                <a className="inline-flex items-center gap-2 underline" href="https://www.instagram.com/bee.u.school/" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white"><FaInstagram className="w-3.5 h-3.5" aria-hidden /></span>
                  Instagram
                </a>
                <a className="inline-flex items-center gap-2 underline" href="https://www.facebook.com/profile.php?id=100075049137637" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1877F2] text-white"><FaFacebookF className="w-3.5 h-3.5" aria-hidden /></span>
                  Facebook
                </a>
              </div>
            </div>
          </Card>
          <Card padding="lg" accent={false} className="overflow-hidden">
            <Image src={ContactImg} alt="Atendimento Bee U" className="w-full h-48 object-cover" />
          </Card>
        </div>
      </div>
    </div>
  );
}