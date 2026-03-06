// ---------------------------------------------------------------------------
// Prisma client singleton
//
// Reuses a single PrismaClient instance across hot-reloads in development to
// avoid exhausting the database connection pool (Next.js dev mode re-imports
// modules on every request).
// ---------------------------------------------------------------------------

import { PrismaClient } from "@prisma/client";

declare global {
  // `var` is required here: TypeScript's `declare global` only supports `var`
  // for augmenting the global namespace in a module file.
  var __prisma: PrismaClient | undefined;
}

export const db: PrismaClient =
  globalThis.__prisma ?? (globalThis.__prisma = new PrismaClient());

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = db;
}
