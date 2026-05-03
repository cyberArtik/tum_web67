import { Router } from "express";

import { isRole, signToken, ROLES } from "../auth";

export const tokenRouter = Router();

/**
 * Issue a short-lived JWT for the requested role.
 *
 * Two ways to call (per Lab 7 spec):
 *   POST /token  body { "role": "ADMIN" }
 *   GET  /token?role=ADMIN
 *
 * The token expires in 60 seconds and embeds:
 *   { role: "ADMIN", permissions: ["READ","WRITE","DELETE"], iat, exp }
 */
function handle(role: unknown): { status: number; body: Record<string, unknown> } {
  if (!isRole(role)) {
    return {
      status: 400,
      body: {
        error: "Invalid or missing role",
        accepted_roles: ROLES,
      },
    };
  }
  const { token, expiresIn, permissions } = signToken(role);
  return {
    status: 200,
    body: {
      access_token: token,
      token_type: "Bearer",
      expires_in: expiresIn,
      role,
      permissions,
    },
  };
}

tokenRouter.post("/", (req, res) => {
  const { status, body } = handle(req.body?.role);
  res.status(status).json(body);
});

tokenRouter.get("/", (req, res) => {
  const { status, body } = handle(req.query.role);
  res.status(status).json(body);
});
