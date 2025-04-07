// Test script for MCP with cursor pagination
require('dotenv').config();
const { ProfileController } = require('./dist/lib/controllers/profile.controller');

// Function to test profile creation
async function testCreateProfile() {
  try {
    // Generate a unique ID
    const userId = `user_${Date.now()}`;
    
    console.log('Creating test profile...');
    const profile = await ProfileController.createProfile({
      userId,
      email: `test-${Date.now()}@example.com`,
      subscriptionActive: false
    });
    
    console.log('Profile created successfully:');
    console.log(profile);
    
    return profile;
  } catch (error) {
    console.error('Error creating profile:', error.message);
    return null;
  }
}

// Function to test profile retrieval
async function testGetProfile(userId) {
  try {
    console.log(`\nRetrieving profile for user ID: ${userId}`);
    const profile = await ProfileController.getProfileByUserId(userId);
    
    if (profile) {
      console.log('Profile retrieved successfully:');
      console.log(profile);
    } else {
      console.log('Profile not found');
    }
    
    return profile;
  } catch (error) {
    console.error('Error retrieving profile:', error.message);
    return null;
  }
}

// Function to test profile update
async function testUpdateProfile(userId) {
  try {
    console.log(`\nUpdating profile for user ID: ${userId}`);
    const updatedProfile = await ProfileController.updateProfile(userId, {
      subscriptionActive: true,
      subscriptionTier: 'premium'
    });
    
    console.log('Profile updated successfully:');
    console.log(updatedProfile);
    
    return updatedProfile;
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return null;
  }
}

// Function to test cursor-based pagination
async function testPagination() {
  try {
    console.log('\nTesting cursor-based pagination...');
    
    // First page (no cursor)
    console.log('Fetching first page:');
    const firstPage = await ProfileController.getAllProfiles({
      take: 2,
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Retrieved ${firstPage.data.length} profiles`);
    console.log('Pagination metadata:', firstPage.metadata);
    
    // If we have a next page, fetch it using the cursor
    if (firstPage.metadata.hasNextPage && firstPage.metadata.nextCursor) {
      console.log('\nFetching second page:');
      const secondPage = await ProfileController.getAllProfiles({
        take: 2,
        cursor: firstPage.metadata.nextCursor,
        orderBy: { createdAt: 'desc' }
      });
      
      console.log(`Retrieved ${secondPage.data.length} profiles`);
      console.log('Pagination metadata:', secondPage.metadata);
    } else {
      console.log('No more pages available');
    }
  } catch (error) {
    console.error('Error testing pagination:', error.message);
  }
}

// Main test function
async function runTests() {
  try {
    // Create a profile
    const newProfile = await testCreateProfile();
    
    if (newProfile) {
      // Get the profile
      await testGetProfile(newProfile.userId);
      
      // Update the profile
      await testUpdateProfile(newProfile.userId);
    }
    
    // Test pagination
    await testPagination();
    
    console.log('\nTests completed successfully');
  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    // We should disconnect from the database here
    const { BaseModel } = require('./dist/lib/models/base.model');
    await BaseModel.disconnect();
  }
}

// Run the tests
runTests(); 