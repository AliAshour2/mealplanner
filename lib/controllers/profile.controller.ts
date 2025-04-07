import { Profile } from '@prisma/client';
import { 
  ProfileModel, 
  CreateProfileParams, 
  UpdateProfileParams,
  ProfileFilterParams
} from '../models/profile.model';
import { PaginationOptions, PaginatedResult } from '../models/base.model';

/**
 * Controller class to handle business logic for profiles
 */
export class ProfileController {
  /**
   * Get a profile by its ID
   */
  static async getProfileById(id: string): Promise<Profile | null> {
    return ProfileModel.findById(id);
  }
  
  /**
   * Get a profile by user ID
   */
  static async getProfileByUserId(userId: string): Promise<Profile | null> {
    return ProfileModel.findByUserId(userId);
  }
  
  /**
   * Create a new profile
   */
  static async createProfile(data: CreateProfileParams): Promise<Profile> {
    // Validate email
    if (!data.email || !data.email.includes('@')) {
      throw new Error('Invalid email provided');
    }
    
    // Check if user already exists
    const existingProfile = await ProfileModel.findByUserId(data.userId);
    if (existingProfile) {
      throw new Error('Profile already exists for this user');
    }
    
    return ProfileModel.create(data);
  }
  
  /**
   * Update a profile
   */
  static async updateProfile(userId: string, data: UpdateProfileParams): Promise<Profile> {
    // Check if profile exists
    const existingProfile = await ProfileModel.findByUserId(userId);
    if (!existingProfile) {
      throw new Error('Profile not found');
    }
    
    return ProfileModel.update(userId, data);
  }
  
  /**
   * Delete a profile
   */
  static async deleteProfile(userId: string): Promise<Profile> {
    // Check if profile exists
    const existingProfile = await ProfileModel.findByUserId(userId);
    if (!existingProfile) {
      throw new Error('Profile not found');
    }
    
    return ProfileModel.delete(userId);
  }
  
  /**
   * Get all profiles with pagination
   */
  static async getAllProfiles(
    options: PaginationOptions = {},
    filters: ProfileFilterParams = {}
  ): Promise<PaginatedResult<Profile>> {
    return ProfileModel.findAll(options, filters);
  }
  
  /**
   * Get profiles by subscription status with pagination
   */
  static async getProfilesBySubscriptionStatus(
    active: boolean,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<Profile>> {
    return ProfileModel.findBySubscriptionStatus(active, options);
  }
  
  /**
   * Get profiles by subscription tier with pagination
   */
  static async getProfilesBySubscriptionTier(
    tier: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<Profile>> {
    return ProfileModel.findBySubscriptionTier(tier, options);
  }
  
  /**
   * Execute a raw SQL query (for admin use only)
   */
  static async executeRawQuery(query: string, params: any[] = []): Promise<any[]> {
    // In a real application, you would add security checks here
    return ProfileModel.executeRaw(query, params);
  }
} 