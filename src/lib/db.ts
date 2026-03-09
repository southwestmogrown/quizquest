// ---------------------------------------------------------------------------
// Prisma client singleton
//
// Reuses a single PrismaClient instance across hot-reloads in development to
// avoid exhausting the database connection pool (Next.js dev mode re-imports
// modules on every request).
//
// Prisma 7 removed the datasource `url` field from schema.prisma.  The
// runtime client must be initialised with a Driver Adapter.  We use
// @prisma/adapter-pg (backed by node-postgres) and read the connection URL
// from DATABASE_URL.
//
// The client is created LAZILY (via a Proxy) so that importing this module
// during `next build` — where DATABASE_URL is not set — does not throw.
// The constructor is only called when the first DB method is accessed, which
// happens at request time when DATABASE_URL is present.
// ---------------------------------------------------------------------------

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // `var` is required here: TypeScript's `declare global` only supports `var`
  // for augmenting the global namespace in a module file.
  var __prisma: PrismaClient | undefined;
}

function getPrisma(): PrismaClient {
  if (!globalThis.__prisma) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    globalThis.__prisma = new PrismaClient({ adapter });
  }
  return globalThis.__prisma;
}

// `db` behaves exactly like a PrismaClient but the underlying instance is
// created on the first property access, not at module-evaluation time.
// This allows `next build` to succeed without a live DATABASE_URL.
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, client);
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }
    return value;
  },
});
