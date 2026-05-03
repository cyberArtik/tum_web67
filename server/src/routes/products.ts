import { Router } from "express";

import { requirePermission } from "../middleware/auth";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../store/products";
import type { ProductInput } from "../types";

export const productsRouter = Router();

const REQUIRED_FIELDS: (keyof ProductInput)[] = [
  "article_id",
  "name_ro",
  "name_ru",
  "name_en",
  "price",
  "stock",
  "category",
  "image_url",
];

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = parseInt(String(value ?? ""), 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

// GET /products?limit=20&offset=0 — requires READ
productsRouter.get("/", requirePermission("READ"), async (req, res, next) => {
  try {
    const limit = clampInt(req.query.limit, 1, 100, 20);
    const offset = clampInt(req.query.offset, 0, Number.MAX_SAFE_INTEGER, 0);
    const all = await listProducts();
    const data = all.slice(offset, offset + limit);

    res
      .status(200)
      .header("X-Total-Count", String(all.length))
      .json({ data, total: all.length, limit, offset });
  } catch (err) {
    next(err);
  }
});

// GET /products/:id — requires READ
productsRouter.get("/:id", requirePermission("READ"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid product id" });
    }
    const product = await getProduct(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

// POST /products — requires WRITE
productsRouter.post("/", requirePermission("WRITE"), async (req, res, next) => {
  try {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({ error: "Request body must be a JSON object" });
    }
    for (const f of REQUIRED_FIELDS) {
      if (body[f] === undefined || body[f] === null) {
        return res.status(400).json({ error: `Missing required field: ${f}` });
      }
    }

    const product = await createProduct({
      article_id: String(body.article_id),
      name_ro: String(body.name_ro),
      name_ru: String(body.name_ru),
      name_en: String(body.name_en),
      description_ro: body.description_ro,
      description_ru: body.description_ru,
      description_en: body.description_en,
      price: Number(body.price),
      original_price: body.original_price !== undefined ? Number(body.original_price) : undefined,
      stock: Number(body.stock),
      category: String(body.category),
      brand: body.brand,
      age_group: body.age_group,
      image_url: String(body.image_url),
      tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
      rating: Number(body.rating ?? 0),
      reviews_count:
        body.reviews_count !== undefined ? Number(body.reviews_count) : undefined,
      is_active: body.is_active ?? true,
    });
    res.status(201).header("Location", `/products/${product.id}`).json(product);
  } catch (err) {
    next(err);
  }
});

// PATCH /products/:id — requires WRITE
productsRouter.patch("/:id", requirePermission("WRITE"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid product id" });
    }
    const updated = await updateProduct(id, (req.body ?? {}) as Partial<ProductInput>);
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /products/:id — requires DELETE
productsRouter.delete("/:id", requirePermission("DELETE"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid product id" });
    }
    const ok = await deleteProduct(id);
    if (!ok) return res.status(404).json({ error: "Product not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
