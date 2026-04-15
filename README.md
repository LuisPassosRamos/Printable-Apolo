# Printable Apolo - Catalogo de Impressao 3D

Site estatico de catalogo de produtos de impressao 3D com botoes de compra direto no WhatsApp e integracao com Google Sheets.

## Stack

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS v4** (tema via diretiva `@theme`, sem `tailwind.config.js`)
- **Google Sheets** - leitura de dados via URL publicada (CSV ou JSON)

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

## Configuracao

Configure o numero do WhatsApp em `src/config.ts` e copie `.env.example` para `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Depois preencha os valores:

```bash
# obrigatorio (link CSV publicado ou endpoint JSON)
VITE_GOOGLE_SHEETS_JSON_URL=
```

### Seguranca (frontend-only)

- Este projeto eh estatico e consome Google Sheets direto no navegador.
- Qualquer variavel `VITE_*` pode ser extraida por usuarios finais.
- Prefira planilha/endpoint somente leitura para catalogo publico.
- Nunca commite `.env` com credenciais reais.
- Mantenha no repositorio apenas `.env.example`.

### Google Sheets

1. Publique sua planilha e copie a URL CSV/JSON de leitura.
2. Use o schema abaixo na planilha:

    | ID | PRODUTO | IMAGEM | CUSTO DE PRODUCAO | VALOR DE VENDA | TAG | SAIDAS | IMAGEM_PATH |
    |----|---------|--------|-------------------|----------------|-----|--------|-------------|

3. Regras de mapeamento no frontend:

    - Preco exibido no catalogo: sempre `VALOR DE VENDA`.
    - Imagem exibida: somente `IMAGEM_PATH` (URL publica, preferencialmente Drive).
    - `CUSTO DE PRODUCAO` permanece na base para operacao interna (nao exibido no card).

4. Configure `VITE_GOOGLE_SHEETS_JSON_URL` com a URL de leitura publica.
5. Exemplo de CSV publicado suportado:

```text
https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv
```

### Imagens

O frontend consome apenas links publicos em `IMAGEM_PATH` (exemplo: `https://drive.google.com/uc?export=view&id=...`). Se `IMAGEM_PATH` estiver vazio, o card usa placeholder local.

### AppSheet

O AppSheet pode continuar sendo usado como interface visual para cadastrar/editar/remover estoque. As alteracoes precisam refletir na planilha conectada ao site.

---

## Estrutura do projeto

```
src/
├── config.ts                        # numero WhatsApp e variaveis do Google Sheets
├── types/product.ts                 # interface Product
├── services/
│   └── appSheetService.ts           # fetch Google Sheets + mapeamento para Product
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



