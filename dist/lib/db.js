const { PrismaClient } = require('@prisma/client');

// Prevent multiple instances of Prisma Client in development
const prismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

/**
 * Database connection client
 * Uses connection string from environment variable
 */
module.exports = {
  db: prismaClient,
  DBClient: PrismaClient
}; 