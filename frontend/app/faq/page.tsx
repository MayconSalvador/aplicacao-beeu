export default function FaqPage() {
  return (
    <div className="space-y-6">
      <div className="brand-accent" />
      <h1 className="text-2xl font-bold">FAQ</h1>
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Como faço a matrícula?</h2>
          <p>Acesse um curso, clique em Comprar e siga o checkout.</p>
        </div>
        <div>
          <h2 className="font-semibold">Quais são as formas de pagamento?</h2>
          <p>PIX, boleto e cartão via provedores integrados.</p>
        </div>
        <div>
          <h2 className="font-semibold">Posso cancelar?</h2>
          <p>Sim, conforme política da escola. Fale com o suporte.</p>
        </div>
      </div>
    </div>
  );
}