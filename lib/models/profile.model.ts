import { Profile } from '@prisma/client';
import { BaseModel, PaginationOptions, PaginatedResult } from './base.model';

export type ProfileModel = Profile;

export interface CreateProfileParams {
  userId: string;
  email: string;
  subscriptionActive?: boolean;
  subscriptionTier?: string;
  stripeSubscriptionId?: string;
}

export interface UpdateProfileParams {
  subscriptionActive?: boolean;
  subscriptionTier?: string;
  stripeSubscriptionId?: string;
}

export interface ProfileFilterParams {
  subscriptionActive?: boolean;
  subscriptionTier?: string;
}

/**
 * Profile model class to interact with the Profile table
 * Supports cursor-based pagination
 */
export class ProfileModel extends BaseModel {
  static readonly tableName = 'Profile';
  
  /**
   * Find a profile by userId
   */
  static async findByUserId(userId: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: { userId }
    });
  }

  /**
   * Find a profile by id
   */
  static async findById(id: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: { id }
    });
  }

  /**
   * Create a new profile
   */
  static async create(data: CreateProfileParams): Promise<Profile> {
    return this.prisma.profile.create({
      data
    });
  }

  /**
   * Update a profile
   */
  static async update(userId: string, data: UpdateProfileParams): Promise<Profile> {
    return this.prisma.profile.update({
      where: { userId },
      data
    });
  }

  /**
   * Delete a profile
   */
  static async delete(userId: string): Promise<Profile> {
    return this.prisma.profile.delete({
      where: { userId }
    });
  }
  
  /**
   * Find all profiles with pagination
   * Supports cursor-based pagination for efficient data retrieval
   */
  static async findAll(
    options: PaginationOptions = {},
    filters: ProfileFilterParams = {}
  ): Promise<PaginatedResult<Profile>> {
    return this.findWithPagination<Profile>(
      'profile',
      options,
      filters
    );
  }
  
  /**
   * Find profiles by subscription status with pagination
   */
  static async findBySubscriptionStatus(
    active: boolean,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<Profile>> {
    return this.findWithPagination<Profile>(
      'profile',
      options,
      { subscriptionActive: active }
    );
  }
  
  /**
   * Find profiles by subscription tier with pagination
   */
  static async findBySubscriptionTier(
    tier: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<Profile>> {
    return this.findWithPagination<Profile>(
      'profile',
      options,
      { subscriptionTier: tier }
    );
  }
  
  /**
   * Execute a raw SQL query for advanced use cases
   */
  static async executeRaw(sql: string, params: any[] = []): Promise<any[]> {
    return this.executeRawQuery(sql, params);
  }
} 