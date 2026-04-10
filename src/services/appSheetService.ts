import type { Product } from '../types/product';
import { APPSHEET_ACCESS_KEY, APPSHEET_ACTION_URL, APPSHEET_APP_NAME, APPSHEET_TABLE_NAME } from '../config';

type AppSheetRow = Record<string, unknown>;

export interface FetchProductsResult {
  products: Product[];
}

function normalizeKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function getField(row: AppSheetRow, ...candidateKeys: string[]): string {
  const entries = Object.entries(row);
  for (const key of candidateKeys) {
    const normalizedKey = normalizeKey(key);
    const match = entries.find(([rawKey]) => normalizeKey(rawKey) === normalizedKey);
    if (match) {
      const value = match[1];
      if (value === null || value === undefined) return '';
      return String(value).trim();
    }
  }
  return '';
}

function parseNumber(rawValue: string): number {
  if (!rawValue) return 0;

  const sanitized = rawValue
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '')
    .replace(',', '.');

  const value = Number(sanitized);
  return Number.isFinite(value) ? value : 0;
}

function normalizeTagList(rawValue: string): string {
  if (!rawValue) return '';

  const tags = rawValue
    .split(/[,;\n|]+/)
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  return Array.from(new Set(tags)).join(', ');
}

function normalizeImageUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;

  // AppSheet stores images as relative file paths; construct the CDN URL when possible
  if (APPSHEET_APP_NAME && APPSHEET_TABLE_NAME && APPSHEET_ACCESS_KEY) {
    return `https://www.appsheet.com/template/gettablefileurl?appName=${encodeURIComponent(APPSHEET_APP_NAME)}&tableName=${encodeURIComponent(APPSHEET_TABLE_NAME)}&fileName=${encodeURIComponent(rawUrl)}&accessKey=${encodeURIComponent(APPSHEET_ACCESS_KEY)}`;
  }

  return rawUrl;
}

function rowToProduct(row: AppSheetRow, index: number): Product | null {
  const name = getField(row, 'name', 'nome', 'produto', 'product');
  const priceRaw = getField(
    row,
    'price',
    'preco',
    'valor',
    'valorunitario',
    'unitprice',
    'valordevenda',
    'vendaprecio',
    'custodeproducao'
  );

  if (!name || !priceRaw) return null;

  const id = getField(row, 'id');
  const imageRaw = getField(row, 'imageUrl', 'imagem', 'image', 'foto', 'imagemurl', 'img', 'thumbnail', 'picture');
  const imageUrl = normalizeImageUrl(imageRaw);
  const tag = normalizeTagList(getField(row, 'tag', 'categoria', 'categoriaid', 'type', 'tags', 'categorias'));
  const salesCountRaw = getField(row, 'salesCount', 'sales', 'vendas', 'vendidos', 'saidas', 'saída', 'saida');
  const description = getField(row, 'description', 'descricao', 'detalhes');

  return {
    id: id || String(index + 1),
    name,
    price: parseNumber(priceRaw),
    imageUrl: imageUrl || `https://placehold.co/400x300/2F5F73/ffffff?text=${encodeURIComponent(name)}`,
    tag,
    salesCount: Math.trunc(parseNumber(salesCountRaw)),
    description: description || `Produto cadastrado no AppSheet: ${name}`,
  };
}

function extractRows(payload: unknown): AppSheetRow[] {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is AppSheetRow => !!item && typeof item === 'object');
  }

  if (!payload || typeof payload !== 'object') return [];

  const maybeRows = (payload as { Rows?: unknown }).Rows;
  if (!Array.isArray(maybeRows)) return [];

  return maybeRows.filter((item): item is AppSheetRow => !!item && typeof item === 'object');
}

export async function fetchProducts(): Promise<FetchProductsResult> {
  if (!APPSHEET_ACTION_URL || !APPSHEET_ACCESS_KEY) {
    if (import.meta.env.DEV) {
      console.warn('AppSheet is not configured. Returning empty catalog.');
    }
    return { products: [] };
  }

  try {
    const response = await fetch(APPSHEET_ACTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ApplicationAccessKey: APPSHEET_ACCESS_KEY,
      },
      body: JSON.stringify({
        Action: 'Find',
        Properties: {
          Locale: 'pt-BR',
          Timezone: 'E. South America Standard Time',
        },
        Rows: [],
      }),
    });

    if (!response.ok) {
      const responseBody = await response.text();
      throw new Error(`HTTP ${response.status} - ${responseBody}`);
    }

    const payload = (await response.json()) as unknown;
    const rows = extractRows(payload);

    const products = rows
      .map((row, i) => rowToProduct(row, i))
      .filter((product): product is Product => product !== null);

    if (import.meta.env.DEV && rows.length > 0 && products.length === 0) {
      console.warn('AppSheet returned rows, but none matched the expected product fields.', payload);
    }

    return { products };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error fetching products from AppSheet:', error);
    }
    return { products: [] };
  }
}
