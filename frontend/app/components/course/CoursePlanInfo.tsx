type Props = {
  priceBr?: number | string;
  durationMonths?: number | string;
  compact?: boolean;
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'emerald' | 'blue' | 'gray';
};

export default function CoursePlanInfo({ priceBr, durationMonths, compact = false, className = "", size = 'sm', variant = 'emerald' }: Props) {
  const dm = Number(durationMonths);
  const months = Number.isFinite(dm) && dm > 0 ? dm : 6;
  const price = parseFloat(String(priceBr ?? "0"));
  const monthly = months > 0 ? price / months : price;
  const monthlyFmt = monthly.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (compact) {
    return (
      <p
        className={`text-sm text-gray-700 ${className}`}
        aria-label={`Plano de ${months} meses. Mensalidade R$ ${monthlyFmt}`}
      >
        Plano de {months} meses • Mensalidade R$ {monthlyFmt}
      </p>
    );
  }

  const sizeClasses = size === 'md' ? 'text-sm px-2.5 py-1' : 'text-xs px-2 py-0.5';
  const variantClasses = {
    emerald: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    gray: 'bg-gray-200 text-gray-700',
  }[variant];

  return (
    <div
      className={className}
      role="group"
      aria-label={`Plano de ${months} meses. Mensalidade R$ ${monthlyFmt}`}
    >
      <span className={`inline-flex items-center rounded-full ${variantClasses} ${sizeClasses} mt-1`}>Plano de {months} meses</span>
      <p className={size === 'md' ? 'text-sm text-gray-700 mt-1' : 'text-xs text-gray-700 mt-1'}>Mensalidade R$ {monthlyFmt}</p>
    </div>
  );
}