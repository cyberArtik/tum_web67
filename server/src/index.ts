import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { config } from "./config";
import { errorHandler, notFoundHandler } from "./middleware/errors";
import { requestLogger } from "./middleware/logger";
import { openApiSpec } from "./openapi";
import { productsRouter } from "./routes/products";
import { tokenRouter } from "./routes/token";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "funkids-api" });
});

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, { customSiteTitle: "funkids API — Swagger UI" }),
);
app.get("/openapi.json", (_req, res) => res.json(openApiSpec));

app.use("/token", tokenRouter);
app.use("/products", productsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`funkids API running at http://localhost:${config.port}`);
  // eslint-disable-next-line no-console
  console.log(`           docs at http://localhost:${config.port}/docs`);
});
