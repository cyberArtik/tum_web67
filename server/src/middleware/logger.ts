import type { NextFunction, Request, Response } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const started = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - started;
    const colour = res.statusCode >= 500 ? "\x1b[31m"
      : res.statusCode >= 400 ? "\x1b[33m"
      : "\x1b[32m";
    const reset = "\x1b[0m";
    // eslint-disable-next-line no-console
    console.log(
      `${colour}${res.statusCode}${reset} ${req.method} ${req.originalUrl} ${ms}ms`,
    );
  });
  next();
}
