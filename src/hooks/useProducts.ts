import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { MOCK_PRODUCTS } from "@/data/products";
import { apiFetch, isApiConfigured } from "@/lib/api";
import { cacheGet, cacheSet } from "@/lib/db";
import type { Product } from "@/types";

const PRODUCTS_KEY = "products:all";
const PRODUCTS_TTL_MS = 1000 * 60 * 30;

interface ProductsPage {
  data: Product[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Source-of-truth resolution (in order):
 *   1. IndexedDB cache (instant)
 *   2. If logged in, GET /products with bearer token, then update cache
 *   3. Fall back to MOCK_PRODUCTS (offline / no API / not logged in)
 */
export function useProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const { token } = useAuth();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cached = await cacheGet<Product[]>(PRODUCTS_KEY);
      if (cached && cached.length > 0 && !cancelled) {
        setProducts(cached);
      }

      if (isApiConfigured && token) {
        try {
          const page = await apiFetch<ProductsPage>("/products?limit=100", { token });
          if (cancelled) return;
          setProducts(page.data);
          cacheSet(PRODUCTS_KEY, page.data, PRODUCTS_TTL_MS);
          return;
        } catch {
          // Fall through to whatever we already have.
        }
      }

      if (!cached) {
        cacheSet(PRODUCTS_KEY, MOCK_PRODUCTS, PRODUCTS_TTL_MS);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return products;
}

export function useProduct(id: number): Product | undefined {
  const products = useProducts();
  return products.find((p) => p.id === id);
}
