import pg from "pg";
import { readEnv } from "../config/env.js";

const { Pool } = pg;

export function createDbPool(connectionString = readEnv().databaseUrl): pg.Pool {
  return new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}
