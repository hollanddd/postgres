import { describe, afterEach, expect, it, vi } from "vitest";
import { sql } from "./sql";

const client = {
  apply: vi.fn(),
  query: vi.fn(),
  release: vi.fn(),
};

vi.mock("pg", async () => {
  const actual = <Record<string, unknown>>await vi.importActual("pg");

  return {
    ...actual,
    default: {
      Pool: vi.fn(() => ({
        connect: vi.fn(() => client),
      })),
    },
  };
});

describe("sql", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return items successfully", async () => {
    client.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    await sql`SELECT * FROM todos`;

    expect(client.query).toBeCalledWith(`SELECT * FROM "todos"`, []);
    expect(client.release).toBeCalledTimes(1);
  });
});
