# Printable Apolo — Catálogo de Impressão 3D

Site estático de catálogo de produtos de impressão 3D com botões de compra direto no WhatsApp e integração opcional com Google Sheets.

## Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS v4** (tema via diretiva `@theme`, sem `tailwind.config.js`)
- **PapaParse** — parser CSV compliant com RFC 4180

---

## Primeiros passos

```bash
npm install
npm run dev      # servidor de desenvolvimento em http://localhost:5173
npm run build    # compilação de produção (saída em dist/)
npm run preview  # pré-visualiza o build de produção localmente
npm run lint     # ESLint
```

---

## Configuração

Edite **`src/config.ts`** para configurar o número do WhatsApp e o ID da planilha:

```ts
// src/config.ts
export const WHATSAPP_NUMBER = '5511999999999'; // substitua pelo número real (apenas dígitos)
export const GOOGLE_SHEETS_ID = 'YOUR_GOOGLE_SHEETS_ID_HERE'; // substitua pelo ID da planilha
```

### Google Sheets

1. Crie uma planilha pública (Arquivo → Compartilhar → "Qualquer pessoa com o link").
2. Certifique-se de que a **primeira linha** contenha exatamente estes cabeçalhos (nesta ordem):

   | id | name | price | imageUrl | tag | salesCount | description |
   |----|------|-------|----------|-----|------------|-------------|

3. Copie o ID da URL da planilha (o trecho entre `/d/` e `/edit`) e cole em `GOOGLE_SHEETS_ID`.

> Se o Google Sheets não estiver configurado ou estiver inacessível, o site exibe automaticamente 34 produtos de demonstração com um aviso no topo do catálogo.

---

## Estrutura do projeto

```
src/
├── config.ts                        # número WhatsApp e ID do Sheets
├── types/product.ts                 # interface Product
├── services/
│   └── googleSheetsService.ts       # fetch CSV + fallback para mock
└── components/
    ├── HeroSection.tsx              # banner principal com CTAs WhatsApp
    ├── ProductCard.tsx              # card de produto
    ├── ProductCardSkeleton.tsx      # skeleton de carregamento
    ├── FilterBar.tsx                # busca, preço mín/máx e ordenação
    ├── ProductGrid.tsx              # grade de produtos + paginação
    └── Pagination.tsx               # paginação com ellipsis (30 itens/pág)
```

---

## Deploy

O projeto gera arquivos estáticos em `dist/` e pode ser hospedado em qualquer CDN estático (Vercel, Netlify, GitHub Pages, etc.).

```bash
npm run build
# faça o deploy da pasta dist/
```

