import type { Product } from '../types/product';
import { APPSHEET_ACCESS_KEY, APPSHEET_ACTION_URL, APPSHEET_APP_NAME, APPSHEET_TABLE_NAME } from '../config';

type AppSheetRow = Record<string, unknown>;

export interface FetchProductsResult {
  products: Product[];
}

let warnedMissingImageConfig = false;

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

function isLikelyImageValue(value: string): boolean {
  const v = value.trim();
  if (!v) return false;

  // AppSheet commonly returns relative paths like "Table 1_Images/file.jpg".
  if (v.includes('_Images/')) return true;

  // Absolute image URL or filename with common image extension.
  return /\.(png|jpe?g|gif|webp|avif|bmp|svg)(\?.*)?$/i.test(v);
}

function getImageField(row: AppSheetRow): string {
  const fromKnownKeys = getField(
    row,
    'imageUrl',
    'imagem',
    'image',
    'foto',
    'imagemurl',
    'img',
    'thumbnail',
    'picture',
    '-'
  );

  if (fromKnownKeys) return fromKnownKeys;

  // Fallback for unconventional schemas/headers in AppSheet.
  for (const [, rawValue] of Object.entries(row)) {
    if (rawValue === null || rawValue === undefined) continue;
    const value = String(rawValue).trim();
    if (isLikelyImageValue(value)) return value;
  }

  return '';
}

function normalizeImageUrl(rawUrl: string): string {
  if (!rawUrl) return '';

  const value = rawUrl.trim();
  if (!value) return '';

  // Keep absolute URLs untouched (http/https/data/blob/etc.)
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value)) return value;

  // Convert protocol-relative URLs to explicit https
  if (value.startsWith('//')) return `https:${value}`;

  // AppSheet image columns often return relative paths (with or without leading slash)
  // that must be resolved through gettablefileurl.
  const normalizedFileName = value.replace(/^\/+/, '');

  // gettablefileurl requires appName (display name in AppSheet), not appId.
  if (!APPSHEET_APP_NAME || !APPSHEET_TABLE_NAME || !APPSHEET_ACCESS_KEY) {
    if (import.meta.env.DEV && !warnedMissingImageConfig) {
      warnedMissingImageConfig = true;
      console.warn(
        'AppSheet image URL config incomplete. Set VITE_APPSHEET_APP_NAME, VITE_APPSHEET_TABLE_NAME and VITE_APPSHEET_ACCESS_KEY to render image attachments.'
      );
    }
    return '';
  }

  const encodedFileName = encodeURIComponent(normalizedFileName).replace(/%2F/g, '/');

  // AppSheet stores images as relative file paths; construct the CDN URL when possible
  if (normalizedFileName) {
    return `https://www.appsheet.com/template/gettablefileurl?appName=${encodeURIComponent(APPSHEET_APP_NAME)}&tableName=${encodeURIComponent(APPSHEET_TABLE_NAME)}&fileName=${encodedFileName}&accessKey=${encodeURIComponent(APPSHEET_ACCESS_KEY)}`;
  }

  return value;
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
  const imageRaw = getImageField(row);
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

    if (import.meta.env.DEV && products.length > 0) {
      const sample = products.slice(0, 3).map((p) => ({ name: p.name, imageUrl: p.imageUrl }));
      console.info('AppSheet image mapping sample:', sample);
      if (!APPSHEET_APP_NAME) {
        console.warn('VITE_APPSHEET_APP_NAME is empty. Relative image paths from AppSheet will not resolve.');
      }
    }

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
