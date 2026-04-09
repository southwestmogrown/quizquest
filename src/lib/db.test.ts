// ---------------------------------------------------------------------------
// Tests for the lazy Prisma proxy singleton (src/lib/db.ts)
//
// Strategy: mock the three external dependencies (@prisma/client,
// @prisma/adapter-pg, pg) so no real database connection is ever opened.
// We control the `globalThis.__prisma` singleton state between tests.
//
// vi.mock() factories are hoisted before variable declarations, so we use
// vi.hoisted() to define tracking state that the factories can close over.
// ---------------------------------------------------------------------------

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Hoisted spy/state — available inside vi.mock() factories
// ---------------------------------------------------------------------------

const { prismaClientSpy, prismaPgSpy, poolSpy, instances } = vi.hoisted(() => {
  type Instance = {
    prisma: unknown;
    pool: unknown;
    adapter: unknown;
  };

  return {
    prismaClientSpy: vi.fn(),
    prismaPgSpy: vi.fn(),
    poolSpy: vi.fn(),
    instances: { prisma: null, pool: null, adapter: null } as Instance,
  };
});

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@prisma/client", () => {
  class MockPrismaClient {
    opts: unknown;
    user = { findFirst: vi.fn() };
    $connect = vi.fn();
    constructor(opts: unknown) {
      this.opts = opts;
      prismaClientSpy(opts);
      instances.prisma = this;
    }
  }
  return { PrismaClient: MockPrismaClient };
});

vi.mock("@prisma/adapter-pg", () => {
  class MockPrismaPg {
    pool: unknown;
    constructor(pool: unknown) {
      this.pool = pool;
      prismaPgSpy(pool);
      instances.adapter = this;
    }
  }
  return { PrismaPg: MockPrismaPg };
});

vi.mock("pg", () => {
  class MockPool {
    opts: unknown;
    constructor(opts: unknown) {
      this.opts = opts;
      poolSpy(opts);
      instances.pool = this;
    }
  }
  return { Pool: MockPool };
});

// ---------------------------------------------------------------------------
// Import module under test AFTER mocks are declared (hoisting handles order)
// ---------------------------------------------------------------------------

import { db } from "./db";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resetSingleton() {
  globalThis.__prisma = undefined;
  prismaClientSpy.mockClear();
  prismaPgSpy.mockClear();
  poolSpy.mockClear();
  instances.prisma = null;
  instances.pool = null;
  instances.adapter = null;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("db — lazy Prisma proxy", () => {
  beforeEach(() => resetSingleton());
  afterEach(() => resetSingleton());

  it("the exported `db` object exists and is an object (safe to import without DATABASE_URL)", () => {
    expect(db).toBeDefined();
    expect(typeof db).toBe("object");
  });

  it("no PrismaClient constructor call happens before a property is accessed (lazy)", () => {
    // beforeEach wiped the singleton and cleared the spy — if construction
    // were eager it would have fired during module evaluation
    expect(prismaClientSpy).toHaveBeenCalledTimes(0);
  });

  it("accessing a property on the proxy triggers PrismaClient instantiation", () => {
    const _user = db.user;
    expect(prismaClientSpy).toHaveBeenCalledTimes(1);
  });

  it("constructs Pool → PrismaPg → PrismaClient in the correct dependency order", () => {
    const _user = db.user;

    expect(poolSpy).toHaveBeenCalledTimes(1);
    expect(prismaPgSpy).toHaveBeenCalledTimes(1);
    expect(prismaClientSpy).toHaveBeenCalledTimes(1);

    // PrismaPg receives the Pool instance
    expect((instances.adapter as { pool: unknown } | null)?.pool).toBe(
      instances.pool
    );
    // PrismaClient receives { adapter: <PrismaPg instance> }
    expect(
      (instances.prisma as { opts: { adapter: unknown } } | null)?.opts?.adapter
    ).toBe(instances.adapter);
  });

  it("reuses the same PrismaClient instance on subsequent property accesses (singleton)", () => {
    const _a = db.user;
    const _b = db.user;
    const _c = db.$connect;

    // Constructor should be called exactly once, not once per access
    expect(prismaClientSpy).toHaveBeenCalledTimes(1);
  });

  it("proxy returns a bound function when the underlying property is a function", () => {
    const connect = db.$connect;
    expect(typeof connect).toBe("function");
  });

  it("Pool is initialised with DATABASE_URL from the environment", () => {
    const savedUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = "postgresql://test:pass@localhost:5432/mydb";

    try {
      const _user = db.user;
      expect(poolSpy).toHaveBeenCalledWith({
        connectionString: "postgresql://test:pass@localhost:5432/mydb",
      });
    } finally {
      if (savedUrl !== undefined) {
        process.env.DATABASE_URL = savedUrl;
      } else {
        delete process.env.DATABASE_URL;
      }
    }
  });
});
