import express from "express";

import { config } from "./config";
import { productsRouter } from "./routes/products";
import { tokenRouter } from "./routes/token";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "funkids-api" });
});

app.use("/token", tokenRouter);
app.use("/products", productsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(config.port, () => {
  console.log(`funkids API running at http://localhost:${config.port}`);
});
