const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');

// Connection configuration
const connectionString = "postgresql://neondb_owner:npg_Mpw9SLoE5tGC@ep-rapid-snowflake-a2p1o17h-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";

// Create a connection pool
const pool = new Pool({ connectionString });

/**
 * Base Model class with pagination support
 */
class BaseModel {
  static pool = pool;
  
  // Prisma client instance
  static prisma = new PrismaClient();
  
  /**
   * Execute a raw SQL query
   */
  static async executeRawQuery(query, params = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }
  
  /**
   * Base method for paginated queries using cursor pagination
   * This method uses Prisma's cursor-based pagination
   */
  static async findWithPagination(
    model,
    options = {},
    where = {}
  ) {
    const {
      take = 10,
      cursor,
      orderBy = { id: 'asc' }
    } = options;
    
    // Create pagination query
    const paginationQuery = {
      take: take + 1, // Take one more to check if there's a next page
      where,
      orderBy,
    };
    
    // Add cursor if provided
    if (cursor) {
      paginationQuery.cursor = { id: cursor };
      paginationQuery.skip = 1; // Skip the cursor
    }
    
    // Execute query
    const results = await this.prisma[model].findMany(paginationQuery);
    
    // Check if there's a next page
    const hasNextPage = results.length > take;
    
    // Remove the extra item we used to check for next page
    const data = hasNextPage ? results.slice(0, take) : results;
    
    // Get the last item's ID as the next cursor
    const nextCursor = hasNextPage && data.length > 0 ? data[data.length - 1].id : null;
    
    return {
      data,
      metadata: {
        hasNextPage,
        nextCursor,
        count: data.length
      }
    };
  }
  
  /**
   * Disconnect all database connections
   */
  static async disconnect() {
    await this.prisma.$disconnect();
    await pool.end();
  }
}

module.exports = {
  BaseModel,
  pool
}; 