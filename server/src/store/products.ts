import { existsSync, mkdirSync } from "node:fs";
import fs from "node:fs/promises";

import { config } from "../config";
import type { Product, ProductInput } from "../types";
import { SEED_PRODUCTS } from "./seed";

let memCache: Product[] | null = null;
let writeQueue: Promise<void> = Promise.resolve();

async function load(): Promise<Product[]> {
  if (memCache) return memCache;

  if (!existsSync(config.dataDir)) mkdirSync(config.dataDir, { recursive: true });

  try {
    const raw = await fs.readFile(config.dataFile, "utf-8");
    memCache = JSON.parse(raw) as Product[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    memCache = [...SEED_PRODUCTS];
    await fs.writeFile(config.dataFile, JSON.stringify(memCache, null, 2));
  }
  return memCache!;
}

async function persist(products: Product[]) {
  memCache = products;
  // Serialize concurrent writes — file truncation is not atomic across awaits.
  writeQueue = writeQueue
    .catch(() => {})
    .then(() => fs.writeFile(config.dataFile, JSON.stringify(products, null, 2)));
  return writeQueue;
}

export async function listProducts(): Promise<Product[]> {
  return [...(await load())];
}

export async function getProduct(id: number): Promise<Product | null> {
  const all = await load();
  return all.find((p) => p.id === id) ?? null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const all = await load();
  const nextId = all.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  const product: Product = {
    ...input,
    id: nextId,
    created_at: new Date().toISOString(),
  };
  await persist([...all, product]);
  return product;
}

export async function updateProduct(
  id: number,
  patch: Partial<ProductInput>,
): Promise<Product | null> {
  const all = await load();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...patch, id: all[idx].id, created_at: all[idx].created_at };
  const next = [...all];
  next[idx] = updated;
  await persist(next);
  return updated;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const all = await load();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  const next = all.filter((p) => p.id !== id);
  await persist(next);
  return true;
}
