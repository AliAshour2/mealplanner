import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

// Connection configuration
const connectionString = "postgresql://neondb_owner:npg_Mpw9SLoE5tGC@ep-rapid-snowflake-a2p1o17h-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require";

// Create a connection pool
const pool = new Pool({ connectionString });

// Pagination options
export interface PaginationOptions {
  take?: number;
  cursor?: string | null;
  orderBy?: { [key: string]: 'asc' | 'desc' };
}

// Paginated result interface
export interface PaginatedResult<T> {
  data: T[];
  metadata: {
    hasNextPage: boolean;
    nextCursor: string | null;
    count: number;
  }
}

/**
 * Base Model class with pagination support
 */
export class BaseModel {
  // Raw database pool for direct SQL queries
  static pool = pool;
  
  // Prisma client instance
  static prisma = new PrismaClient();
  
  /**
   * Execute a raw SQL query
   */
  static async executeRawQuery<T>(query: string, params: any[] = []): Promise<T[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows as T[];
    } finally {
      client.release();
    }
  }
  
  /**
   * Base method for paginated queries using cursor pagination
   * This method uses Prisma's cursor-based pagination
   */
  static async findWithPagination<T>(
    model: any,
    options: PaginationOptions = {},
    where: any = {}
  ): Promise<PaginatedResult<T>> {
    const {
      take = 10,
      cursor,
      orderBy = { id: 'asc' }
    } = options;
    
    // Create pagination query
    const paginationQuery: any = {
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
      data: data as T[],
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
  static async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
    await pool.end();
  }
} 