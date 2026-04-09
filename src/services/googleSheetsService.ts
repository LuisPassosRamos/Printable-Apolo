import Papa from 'papaparse';
import type { Product } from '../types/product';
import { GOOGLE_SHEETS_CSV_URL } from '../config';

interface ParsedRow {
  id?: string;
  name?: string;
  price?: string;
  imageUrl?: string;
  tag?: string;
  salesCount?: string;
  description?: string;
}

export interface FetchProductsResult {
  products: Product[];
  usedFallback: boolean;
}

function rowToProduct(row: ParsedRow, index: number): Product | null {
  const { id, name, price, imageUrl, tag, salesCount, description } = row;
  if (!name || !price) return null;
  return {
    id: id || String(index + 1),
    name,
    price: parseFloat(price) || 0,
    imageUrl: imageUrl || `https://placehold.co/400x300/2F5F73/ffffff?text=${encodeURIComponent(name)}`,
    tag: tag || '',
    salesCount: parseInt(salesCount ?? '0') || 0,
    description: description || '',
  };
}

export async function fetchProducts(): Promise<FetchProductsResult> {
  try {
    const response = await fetch(GOOGLE_SHEETS_CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csv = await response.text();

    const { data, errors } = Papa.parse<ParsedRow>(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      transform: (v) => v.trim(),
    });

    if (errors.length > 0 && import.meta.env.DEV) {
      console.warn('CSV parse warnings:', errors);
    }

    const products = data
      .map((row, i) => rowToProduct(row, i))
      .filter((p): p is Product => p !== null);

    return { products, usedFallback: false };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error fetching products from Google Sheets:', error);
    }
    return { products: getMockProducts(), usedFallback: true };
  }
}

function getMockProducts(): Product[] {
  const mockItems = [
    { name: 'Vaso Geométrico Moderno', price: 45.90, tag: 'Decoração', sales: 142, img: 'vaso' },
    { name: 'Suporte para Celular', price: 29.90, tag: 'Funcional', sales: 89, img: 'suporte' },
    { name: 'Figura Articulada Dragon', price: 89.90, tag: 'Geek', sales: 203, img: 'dragon' },
    { name: 'Porta-Chaves Personalizado', price: 19.90, tag: 'Personalizado', sales: 315, img: 'chaveiro' },
    { name: 'Organizador de Mesa', price: 55.90, tag: 'Funcional', sales: 67, img: 'organizador' },
    { name: 'Boneco Articulado Robô', price: 79.90, tag: 'Geek', sales: 156, img: 'robo' },
    { name: 'Luminária LED Geométrica', price: 120.00, tag: 'Decoração', sales: 44, img: 'luminaria' },
    { name: 'Kit Miniaturas RPG', price: 65.00, tag: 'Geek', sales: 98, img: 'rpg' },
    { name: 'Porta-Retrato 3D', price: 35.90, tag: 'Decoração', sales: 211, img: 'retrato' },
    { name: 'Brinquedo Educativo Infantil', price: 42.00, tag: 'Infantil', sales: 78, img: 'infantil' },
    { name: 'Capa Personalizada Notebook', price: 95.00, tag: 'Personalizado', sales: 33, img: 'notebook' },
    { name: 'Suporte para Headset', price: 38.90, tag: 'Funcional', sales: 127, img: 'headset' },
    { name: 'Vaso Autoirrigável', price: 59.90, tag: 'Funcional', sales: 91, img: 'autoirrigavel' },
    { name: 'Miniatura Arquitetônica', price: 150.00, tag: 'Decoração', sales: 28, img: 'arquitetura' },
    { name: 'Quebra-cabeça 3D', price: 49.90, tag: 'Infantil', sales: 62, img: 'quebracabeca' },
    { name: 'Suporte de Parede TV', price: 85.00, tag: 'Funcional', sales: 45, img: 'tv' },
    { name: 'Figura Gamer Controller', price: 72.00, tag: 'Geek', sales: 138, img: 'gamer' },
    { name: 'Porta-Canetas Temático', price: 25.90, tag: 'Decoração', sales: 184, img: 'canetas' },
    { name: 'Placa Decorativa Personalizada', price: 68.00, tag: 'Personalizado', sales: 73, img: 'placa' },
    { name: 'Peças de Xadrez 3D', price: 199.90, tag: 'Geek', sales: 19, img: 'xadrez' },
    { name: 'Organizador de Banheiro', price: 44.90, tag: 'Funcional', sales: 156, img: 'banheiro' },
    { name: 'Móbile Infantil', price: 78.00, tag: 'Infantil', sales: 51, img: 'mobile' },
    { name: 'Suporte para Livros', price: 52.00, tag: 'Funcional', sales: 89, img: 'livros' },
    { name: 'Decoração Natalina', price: 15.90, tag: 'Decoração', sales: 423, img: 'natal' },
    { name: 'Mascote Personalizado', price: 180.00, tag: 'Personalizado', sales: 37, img: 'mascote' },
    { name: 'Porta-Sabonete', price: 22.90, tag: 'Funcional', sales: 201, img: 'sabonete' },
    { name: 'Miniaturas Star Wars', price: 95.00, tag: 'Geek', sales: 167, img: 'starwars' },
    { name: 'Relógio de Parede 3D', price: 135.00, tag: 'Decoração', sales: 55, img: 'relogio' },
    { name: 'Alphabet Infantil', price: 39.90, tag: 'Infantil', sales: 93, img: 'alphabet' },
    { name: 'Suporte Universal Tablet', price: 48.90, tag: 'Funcional', sales: 112, img: 'tablet' },
    { name: 'Enfeite de Jardim', price: 32.00, tag: 'Decoração', sales: 78, img: 'jardim' },
    { name: 'Nome Personalizado 3D', price: 55.00, tag: 'Personalizado', sales: 245, img: 'nome' },
    { name: 'Miniatura Carro Clássico', price: 88.00, tag: 'Geek', sales: 61, img: 'carro' },
    { name: 'Totem de Mesa', price: 75.00, tag: 'Personalizado', sales: 43, img: 'totem' },
  ];

  return mockItems.map((item, index) => ({
    id: String(index + 1),
    name: item.name,
    price: item.price,
    imageUrl: `https://placehold.co/400x300/2F5F73/ffffff?text=${encodeURIComponent(item.name)}`,
    tag: item.tag,
    salesCount: item.sales,
    description: `Produto de alta qualidade: ${item.name}`,
  }));
}
