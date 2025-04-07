import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
const prismaClient = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prismaClient;
}

/**
 * Database connection client
 * Uses connection string from environment variable: 
 * postgresql://neondb_owner:npg_Mpw9SLoE5tGC@ep-rapid-snowflake-a2p1o17h-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
 */
export const db = prismaClient;

// Export this for use in models and controllers
export type DBClient = typeof prismaClient; 