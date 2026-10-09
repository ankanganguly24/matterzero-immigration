import "server-only";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type MatterZeroDatabase = PostgresJsDatabase<typeof schema>;
type MatterZeroSqlClient = ReturnType<typeof postgres>;

const globalForDatabase = globalThis as typeof globalThis & {
  matterZeroDatabase?: MatterZeroDatabase;
  matterZeroSqlClient?: MatterZeroSqlClient;
};

export function getDb(): MatterZeroDatabase {
  if (globalForDatabase.matterZeroDatabase) return globalForDatabase.matterZeroDatabase;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Set the server-only DATABASE_URL environment variable.");
  }

  const client = postgres(connectionString, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  globalForDatabase.matterZeroSqlClient = client;
  globalForDatabase.matterZeroDatabase = drizzle(client, { schema });
  return globalForDatabase.matterZeroDatabase;
}
