const { ProfileModel } = require('../models/profile.model');

/**
 * Controller class to handle business logic for profiles
 */
class ProfileController {
  /**
   * Get a profile by its ID
   */
  static async getProfileById(id) {
    return ProfileModel.findById(id);
  }
  
  /**
   * Get a profile by user ID
   */
  static async getProfileByUserId(userId) {
    return ProfileModel.findByUserId(userId);
  }
  
  /**
   * Create a new profile
   */
  static async createProfile(data) {
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
  static async updateProfile(userId, data) {
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
  static async deleteProfile(userId) {
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
    options = {},
    filters = {}
  ) {
    return ProfileModel.findAll(options, filters);
  }
  
  /**
   * Get profiles by subscription status with pagination
   */
  static async getProfilesBySubscriptionStatus(
    active,
    options = {}
  ) {
    return ProfileModel.findBySubscriptionStatus(active, options);
  }
  
  /**
   * Get profiles by subscription tier with pagination
   */
  static async getProfilesBySubscriptionTier(
    tier,
    options = {}
  ) {
    return ProfileModel.findBySubscriptionTier(tier, options);
  }
  
  /**
   * Execute a raw SQL query (for admin use only)
   */
  static async executeRawQuery(query, params = []) {
    // In a real application, you would add security checks here
    return ProfileModel.executeRaw(query, params);
  }
}

module.exports = { ProfileController }; 