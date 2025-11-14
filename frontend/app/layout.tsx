import "./globals.css";
import { ReactNode } from "react";
import NavAuth from "./nav-auth";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="bg-gradient-to-b from-[#0b1b34] to-[#0d2a52] text-white">
          <div className="container mx-auto flex items-center justify-between py-4">
            <a href="/" className="font-semibold tracking-wide">Bee U Bilingual School</a>
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold uppercase">
              <a href="/sobre">Sobre</a>
              <a href="/abordagem">Nossa Abordagem</a>
              <a href="/opinioes">Opiniões</a>
              <a href="/contatos">Contatos</a>
              <a href="/professores">Professores</a>
              <a href="/trabalhe-conosco">Trabalhe Conosco</a>
              <a href="/login" className="ml-2 inline-flex items-center px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600">LOGIN</a>
              <NavAuth />
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4">{children}</main>
        <footer className="bg-gray-900 text-gray-200 mt-10">
          <div className="container mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
            <div>
              <a href="/" className="font-semibold tracking-wide">Bee U Bilingual School</a>
              <p className="mt-3 text-sm text-gray-400">Formar falantes com fluência e domínio do som da língua, com ensino natural e eficiente.</p>
              <p className="mt-2 text-sm">+55 44 9823-6983</p>
              <p className="text-sm">contato@beeuschool.com.br</p>
              <div className="mt-3 inline-flex gap-4 text-sm">
                <a className="underline" href="https://www.facebook.com/profile.php?id=100075049137637" target="_blank" rel="noreferrer">Facebook</a>
                <a className="underline" href="https://api.whatsapp.com/send?phone=554498236983" target="_blank" rel="noreferrer">WhatsApp</a>
                <a className="underline" href="https://www.instagram.com/bee.u.school/" target="_blank" rel="noreferrer">Instagram</a>
              </div>
            </div>
            <div>
              <h5 className="font-semibold">Horário de Funcionamento</h5>
              <div className="mt-3 space-y-1 text-sm text-gray-300">
                <p>Segunda - Terça: <span className="text-gray-100">9:00 - 18:00</span></p>
                <p>Quarta - Quinta: <span className="text-gray-100">9:00 - 18:00</span></p>
                <p>Sexta - Sábado: <span className="text-gray-100">9:00 - 18:00</span></p>
                <p>Domingo: <span className="text-gray-100">Fechado</span></p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}