import "./globals.css";
import { ReactNode } from "react";
import NavAuth from "./nav-auth";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <header className="border-b">
          <div className="brand-accent" />
          <div className="p-4">
          <div className="container mx-auto flex justify-between">
            <a href="/" className="font-semibold">BeeU Escola de Inglês</a>
            <nav className="space-x-4">
              <a href="/cursos">Cursos</a>
              <a href="/suporte">Suporte</a>
              <a href="/faq">FAQ</a>
              <NavAuth />
            </nav>
          </div>
          </div>
        </header>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}