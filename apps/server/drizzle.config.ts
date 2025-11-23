import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://madlab:madlab@localhost:5432/madlab',
  },
  verbose: true,
  strict: true,
} satisfies Config;
