# CoursePlanInfo

Componente para exibir informações de plano e mensalidade de um curso.

## Props

- `priceBr`: número ou string com preço total (em reais).
- `durationMonths`: número ou string com duração do plano (em meses). Fallback: `6`.
- `compact`: exibe em linha única. Padrão: `false`.
- `size`: controla tamanho do badge e tipografia (`'sm' | 'md'`). Padrão: `sm`.
- `variant`: cor do badge (`'emerald' | 'blue' | 'gray'`). Padrão: `emerald`.

## Uso

```tsx
import CoursePlanInfo from '@/app/components/course/CoursePlanInfo';

<CoursePlanInfo priceBr={course.price_br} durationMonths={course.duration_months} />

// Variante compacta
<CoursePlanInfo priceBr={course.price_br} durationMonths={course.duration_months} compact />

// Ajuste de tamanho e cor
<CoursePlanInfo priceBr={course.price_br} durationMonths={course.duration_months} size="md" variant="blue" />
```