import jwt, { type JwtPayload } from "jsonwebtoken";

export type Role = "VISITOR" | "WRITER" | "ADMIN";
export type Permission = "READ" | "WRITE" | "DELETE";

export const ROLES: Role[] = ["VISITOR", "WRITER", "ADMIN"];

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  VISITOR: ["READ"],
  WRITER: ["READ", "WRITE"],
  ADMIN: ["READ", "WRITE", "DELETE"],
};

export const JWT_SECRET = process.env.JWT_SECRET ?? "funkids-dev-secret-change-me";
// Lab 7 demo requirement: 60 seconds
export const JWT_EXPIRES_IN_SECONDS = Number(process.env.JWT_EXPIRES_IN ?? 60);

export interface FunkidsTokenPayload extends JwtPayload {
  role: Role;
  permissions: Permission[];
}

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as string[]).includes(value);
}

export function permissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function signToken(role: Role): { token: string; expiresIn: number; permissions: Permission[] } {
  const permissions = permissionsForRole(role);
  const token = jwt.sign({ role, permissions }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN_SECONDS,
  });
  return { token, expiresIn: JWT_EXPIRES_IN_SECONDS, permissions };
}

export function verifyToken(token: string): FunkidsTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded === "string") {
    throw new Error("Malformed token payload");
  }
  return decoded as FunkidsTokenPayload;
}
