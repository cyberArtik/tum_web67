import { useEffect, useState } from "react";

import { MOCK_PRODUCTS } from "@/data/products";
import { cacheGet, cacheSet } from "@/lib/db";
import type { Product } from "@/types";

const PRODUCTS_KEY = "products:all";
const PRODUCTS_TTL_MS = 1000 * 60 * 30; // 30 min

/**
 * Stale-while-revalidate hook for the product list:
 *   1. Returns `MOCK_PRODUCTS` synchronously so the UI never flashes empty.
 *   2. On mount, reads the IndexedDB cache and replaces with fresher data
 *      if any is stored.
 *   3. Otherwise, primes the cache with the current data so the next page
 *      load can render straight from IndexedDB.
 *
 * When the Lab 7 back-end lands (commit 26), the fallback `MOCK_PRODUCTS`
 * is swapped for `fetch('/products')` and this hook stays unchanged.
 */
export function useProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cached = await cacheGet<Product[]>(PRODUCTS_KEY);
      if (cancelled) return;
      if (cached && cached.length > 0) {
        setProducts(cached);
        return;
      }
      cacheSet(PRODUCTS_KEY, MOCK_PRODUCTS, PRODUCTS_TTL_MS);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return products;
}

export function useProduct(id: number): Product | undefined {
  const products = useProducts();
  return products.find((p) => p.id === id);
}
