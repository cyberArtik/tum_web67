import path from "node:path";

export const config = {
  port: Number(process.env.PORT ?? 4000),
  dataDir: path.resolve(process.cwd(), "data"),
  dataFile: path.resolve(process.cwd(), "data", "products.json"),
};
