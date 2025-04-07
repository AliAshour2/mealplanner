import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

// Helper to serialize dates in profile
function serializeProfile(profile: any) {
  return {
    ...profile,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString()
  };
}

// GET /api/profile - Fetch a user's profile from database
export async function GET(request: NextRequest) {
  try {
    // Get the current authenticated user
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryUserId = searchParams.get('userId');

    // Only allow fetching own profile or check if admin (not implemented)
    if (queryUserId && queryUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized to access this profile' }, { status: 403 });
    }

    // Use the authenticated userId if no query parameter is provided
    const profileUserId = queryUserId || userId;

    // Fetch the profile from database
    const profile = await prisma.profile.findUnique({
      where: { userId: profileUserId }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Return serialized profile with dates as strings
    return NextResponse.json(serializeProfile(profile));
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/profile - Create a new profile
export async function POST(request: NextRequest) {
  try {
    // Get the current authenticated user
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (existingProfile) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 409 });
    }

    // Create new profile
    const newProfile = await prisma.profile.create({
      data: {
        userId,
        email,
        subscriptionActive: false
      }
    });

    // Return serialized profile with dates as strings
    return NextResponse.json(serializeProfile(newProfile), { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/profile - Update an existing profile
export async function PATCH(request: NextRequest) {
  try {
    // Get the current authenticated user
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { subscriptionActive, subscriptionTier, stripeSubscriptionId } = body;

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!existingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Update profile
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        ...(subscriptionActive !== undefined && { subscriptionActive }),
        ...(subscriptionTier !== undefined && { subscriptionTier }),
        ...(stripeSubscriptionId !== undefined && { stripeSubscriptionId })
      }
    });

    // Return serialized profile with dates as strings
    return NextResponse.json(serializeProfile(updatedProfile));
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
