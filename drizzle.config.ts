/** @type {import('drizzle-kit').Config} */
export default {
  schema: "./db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  dialect: "postgresql",
};
