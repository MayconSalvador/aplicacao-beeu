# Design Tokens e Utilitários (Frontend)

Este documento resume os tokens e utilitários criados para padronizar a identidade visual (vermelho/azul), sombras e bordas no frontend.

## Tokens (CSS Variables)

- `--brand-red`, `--brand-blue`: cores base da identidade.
- `--brand-radius-card`: raio padrão de cartões.
- `--brand-shadow-sm`, `--brand-shadow-md`: sombras pequenas e médias.

Definidos em `app/globals.css` na raiz do frontend.

## Utilitários

- `.brand-accent`: barra superior com gradiente vermelho→azul.
- `.brand-card`: wrapper de cartão com borda, raio e hover/active.
- `.brand-badge`: base de badge com padding, raio e tipografia.

### Variantes de Badge

- `.badge-red`: `bg-red-100 text-red-700`
- `.badge-blue`: `bg-blue-100 text-blue-700`
- `.badge-emerald`: `bg-emerald-100 text-emerald-700`
- `.badge-purple`: `bg-purple-100 text-purple-700`

Use combinando com `.brand-badge`, por exemplo:

```html
<span class="brand-badge badge-red">Prática guiada</span>
<span class="brand-badge badge-blue">Materiais inclusos</span>
<span class="brand-badge badge-emerald">Acompanhamento humano</span>
```

## Componentes

- `Card` (`app/components/ui/Card.tsx`): servidor/SSR; aceita `as`, `accent`, `padding`, `title`, `actions`.
- `CardClient` (`app/components/ui/CardClient.tsx`): versão client-side para páginas com `"use client"`.

Exemplo:

```tsx
<Card accent padding="md" title="Curso A" actions={<span className="brand-badge">Nível A1</span>}>
  <p>Descrição do curso...</p>
</Card>
```

## Páginas Atualizadas

- Home (`app/page.tsx`): boxes e cursos em destaque com `Card` e badges.
- Cursos (`app/cursos/page.tsx`): cards de curso com `Card` e badges.
- Curso detalhe (`app/curso/[slug]/page.tsx`): cabeçalho e badges padronizados.
- Conteúdos (`app/conteudos/page.tsx`): `CardClient` e `TypeBadge` usando `.brand-badge`.

## Convenções

- Preferir `Card`/`CardClient` em vez de `div.brand-card` manual.
- Usar `.brand-badge` + variante para chips/badges em listas e cabeçalhos.