const { BaseModel } = require('./base.model');

/**
 * Profile model class to interact with the Profile table
 * Supports cursor-based pagination
 */
class ProfileModel extends BaseModel {
  static tableName = 'Profile';
  
  /**
   * Find a profile by userId
   */
  static async findByUserId(userId) {
    return this.prisma.profile.findUnique({
      where: { userId }
    });
  }

  /**
   * Find a profile by id
   */
  static async findById(id) {
    return this.prisma.profile.findUnique({
      where: { id }
    });
  }

  /**
   * Create a new profile
   */
  static async create(data) {
    return this.prisma.profile.create({
      data
    });
  }

  /**
   * Update a profile
   */
  static async update(userId, data) {
    return this.prisma.profile.update({
      where: { userId },
      data
    });
  }

  /**
   * Delete a profile
   */
  static async delete(userId) {
    return this.prisma.profile.delete({
      where: { userId }
    });
  }
  
  /**
   * Find all profiles with pagination
   * Supports cursor-based pagination for efficient data retrieval
   */
  static async findAll(
    options = {},
    filters = {}
  ) {
    return this.findWithPagination(
      'profile',
      options,
      filters
    );
  }
  
  /**
   * Find profiles by subscription status with pagination
   */
  static async findBySubscriptionStatus(
    active,
    options = {}
  ) {
    return this.findWithPagination(
      'profile',
      options,
      { subscriptionActive: active }
    );
  }
  
  /**
   * Find profiles by subscription tier with pagination
   */
  static async findBySubscriptionTier(
    tier,
    options = {}
  ) {
    return this.findWithPagination(
      'profile',
      options,
      { subscriptionTier: tier }
    );
  }
  
  /**
   * Execute a raw SQL query for advanced use cases
   */
  static async executeRaw(sql, params = []) {
    return this.executeRawQuery(sql, params);
  }
}

module.exports = { ProfileModel }; 