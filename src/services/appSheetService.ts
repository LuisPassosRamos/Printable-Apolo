import type { Product } from '../types/product';
import { GOOGLE_SHEETS_JSON_URL } from '../config';
import { getFallbackImageDataUrl } from '../utils/image';

type SheetsRow = Record<string, unknown>;

export interface FetchProductsResult {
  products: Product[];
}

function toSafeAbsoluteUrl(rawUrl: string): string {
  try {
    const cleanedUrl = rawUrl
      .trim()
      .replace(/^"+|"+$/g, '')
      .replace(/&amp;/gi, '&')
      .replace(/[\u200B-\u200D\uFEFF]/g, '');

    const url = new URL(cleanedUrl);
    if (url.protocol !== 'https:') return '';

    // Convert Google Drive URLs to thumbnail endpoint, which is typically
    // more reliable for <img> rendering across browsers.
    if (url.hostname === 'drive.google.com') {
      const pathMatch = /^\/file\/d\/([^/]+)/.exec(url.pathname);
      const idFromPath = pathMatch?.[1];
      const idFromQuery = url.searchParams.get('id');
      const id = idFromPath || idFromQuery;
      if (id) {
        return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w1200`;
      }
    }

    return url.toString();
  } catch {
    return '';
  }
}

function normalizeKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function getField(row: SheetsRow, ...candidateKeys: string[]): string {
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

function getImageField(row: SheetsRow): string {
  // Security-first rule:
  // prefer IMAGEM_PATH (public URL). If empty, accept IMAGEM only when it is already a URL.
  const imagePath = getField(row, 'imagem_path', 'image_path', 'imagempath', 'imagepath');
  if (imagePath) return imagePath;

  const image = getField(row, 'imagem', 'image', 'foto', 'imageUrl', 'imagemurl');
  if (/^(https?:)?\/\//i.test(image)) return image;

  return '';
}

function normalizeImageUrl(rawUrl: string): string {
  if (!rawUrl) return '';

  const value = rawUrl.trim();
  if (!value) return '';

  // Keep absolute URLs untouched when they are safe.
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value)) {
    return toSafeAbsoluteUrl(value);
  }

  // Convert protocol-relative URLs to explicit https
  if (value.startsWith('//')) return toSafeAbsoluteUrl(`https:${value}`);

  // Relative paths are intentionally ignored.
  return '';
}

function rowToProduct(row: SheetsRow, index: number): Product | null {
  const name = getField(row, 'name', 'nome', 'produto', 'product');
  const priceRaw = getField(
    row,
    // New schema: prefer VALOR DE VENDA for catalog price.
    'valordevenda',
    'vendaprecio',
    'price',
    'preco',
    'valor',
    'valorunitario',
    'unitprice'
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
    imageUrl: imageUrl || getFallbackImageDataUrl(name),
    tag,
    salesCount: Math.trunc(parseNumber(salesCountRaw)),
    description: description || `Produto cadastrado no Google Sheets: ${name}`,
  };
}

function extractRows(payload: unknown): SheetsRow[] {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is SheetsRow => !!item && typeof item === 'object');
  }

  if (!payload || typeof payload !== 'object') return [];

  const maybeData = (payload as { data?: unknown }).data;
  if (Array.isArray(maybeData)) {
    return maybeData.filter((item): item is SheetsRow => !!item && typeof item === 'object');
  }

  const maybeRows = (payload as { rows?: unknown }).rows;
  if (Array.isArray(maybeRows)) {
    return maybeRows.filter((item): item is SheetsRow => !!item && typeof item === 'object');
  }

  const maybeRowsLegacy = (payload as { Rows?: unknown }).Rows;
  if (Array.isArray(maybeRowsLegacy)) {
    return maybeRowsLegacy.filter((item): item is SheetsRow => !!item && typeof item === 'object');
  }

  return [];
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function parseCsvRows(rawCsv: string): SheetsRow[] {
  const lines = rawCsv
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (!lines.length) return [];

  const headers = parseCsvLine(lines[0]).map((header, index) => {
    const normalized = header.replace(/^"|"$/g, '').trim();
    return normalized || `column_${index + 1}`;
  });

  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    return headers.reduce<SheetsRow>((acc, header, index) => {
      acc[header] = (cells[index] ?? '').replace(/^"|"$/g, '').trim();
      return acc;
    }, {});
  });
}

function getSheetsDataUrl(): string {
  return GOOGLE_SHEETS_JSON_URL;
}

async function fetchSheetRows(dataUrl: string): Promise<SheetsRow[]> {
  const response = await fetch(dataUrl, { method: 'GET' });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(`HTTP ${response.status} - ${responseBody}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const payload = (await response.json()) as unknown;
    return extractRows(payload);
  }

  if (contentType.includes('text/csv') || /[?&]output=csv(?:&|$)/i.test(dataUrl)) {
    const csvText = await response.text();
    return parseCsvRows(csvText);
  }

  const rawText = await response.text();

  try {
    const payload = JSON.parse(rawText) as unknown;
    const rows = extractRows(payload);
    if (rows.length > 0) return rows;
  } catch {
    // Ignore JSON parse errors and try gviz parser below.
  }

  const csvRows = parseCsvRows(rawText);
  if (csvRows.length > 0) return csvRows;

  return [];
}

export async function fetchProducts(): Promise<FetchProductsResult> {
  const sheetsDataUrl = getSheetsDataUrl();

  if (!sheetsDataUrl) {
    if (import.meta.env.DEV) {
      console.warn('Google Sheets is not configured. Set VITE_GOOGLE_SHEETS_JSON_URL.');
    }
    return { products: [] };
  }

  try {
    const rows = await fetchSheetRows(sheetsDataUrl);

    const products = rows
      .map((row, i) => rowToProduct(row, i))
      .filter((product): product is Product => product !== null);

    if (import.meta.env.DEV && products.length > 0) {
      const sample = products.slice(0, 3).map((p) => ({ name: p.name, imageUrl: p.imageUrl }));
      console.info('Google Sheets mapping sample:', sample);
      const rowsWithoutImagePath = rows.filter((row) => {
        const imagePath = getField(row, 'imagem_path', 'image_path', 'imagempath', 'imagepath');
        return !imagePath;
      }).length;

      if (rowsWithoutImagePath > 0) {
        console.info(
          `Rows with empty IMAGEM_PATH using local placeholder image: ${rowsWithoutImagePath}`
        );
      }
    }

    if (import.meta.env.DEV && rows.length > 0 && products.length === 0) {
      console.warn('Google Sheets returned rows, but none matched the expected product fields.');
    }

    return { products };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error fetching products from Google Sheets:', error);
    }
    throw error instanceof Error ? error : new Error('Failed to fetch products from Google Sheets');
  }
}
