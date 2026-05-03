import express from "express";

import { config } from "./config";
import { productsRouter } from "./routes/products";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "funkids-api" });
});

app.use("/products", productsRouter);

// 404 fallback for any unmatched route.
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(config.port, () => {
  console.log(`funkids API running at http://localhost:${config.port}`);
});
