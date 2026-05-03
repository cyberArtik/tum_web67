import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { verifyToken, type FunkidsTokenPayload, type Permission } from "../auth";

declare module "express-serve-static-core" {
  interface Request {
    auth?: FunkidsTokenPayload;
  }
}

function readBearer(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || typeof header !== "string") return null;
  const [scheme, value] = header.split(" ");
  if (scheme !== "Bearer" || !value) return null;
  return value.trim();
}

/**
 * Reject the request unless the bearer token is valid AND its `permissions`
 * array contains the required permission for this route.
 */
export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = readBearer(req);
    if (!token) {
      return res.status(401).json({ error: "Missing bearer token" });
    }
    try {
      const payload = verifyToken(token);
      if (!payload.permissions?.includes(permission)) {
        return res.status(403).json({
          error: `Permission denied: ${permission} required`,
          role: payload.role,
          permissions: payload.permissions,
        });
      }
      req.auth = payload;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: "Token expired" });
      }
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: "Invalid token" });
      }
      next(err);
    }
  };
}
