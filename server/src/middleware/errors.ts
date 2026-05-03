import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

// Express identifies error handlers by their 4-arg signature, even when `next` is unused.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  // eslint-disable-next-line no-console
  console.error("[error]", err);

  // SyntaxError fired by express.json() body parsing
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Malformed JSON body" });
  }

  const status = (err as { status?: number })?.status ?? 500;
  const message =
    err instanceof Error ? err.message : "Internal server error";
  res.status(status).json({ error: message });
}
