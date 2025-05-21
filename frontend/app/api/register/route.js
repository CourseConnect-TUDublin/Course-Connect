import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Registration from '../../../models/Registration';
import Module from '../../../models/Module';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Validation function
const validateRegistrationData = (data) => {
  const errors = [];
  const missingFields = [];

  // Required fields validation
  if (!data.email) {
    missingFields.push('email');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  if (!data.disciplineId || !ObjectId.isValid(data.disciplineId)) {
    missingFields.push('disciplineId');
  }

  if (!data.courseId || !ObjectId.isValid(data.courseId)) {
    missingFields.push('courseId');
  }

  if (!data.year || data.year < 1 || data.year > 4) {
    missingFields.push('year');
  }

  if (!data.semester || data.semester < 1 || data.semester > 2) {
    missingFields.push('semester');
  }

  if (!data.group || typeof data.group !== 'string' || data.group.trim().length === 0) {
    missingFields.push('group');
  }

  // Optional fields validation
  if (data.phone && !/^\+?[\d\s-]{10,}$/.test(data.phone)) {
    errors.push('Invalid phone number format');
  }

  // Module selection validation
  if (!Array.isArray(data.selectedModules) || data.selectedModules.length === 0) {
    missingFields.push('selectedModules');
  } else {
    const invalidModules = data.selectedModules.some(moduleId => !ObjectId.isValid(moduleId));
    if (invalidModules) {
      errors.push('One or more invalid module IDs');
    }
  }

  // Log validation issues
  if (missingFields.length > 0) {
    console.warn('❌ Missing required fields:', missingFields);
  }
  if (errors.length > 0) {
    console.warn('❌ Validation errors:', errors);
  }

  return {
    hasErrors: errors.length > 0 || missingFields.length > 0,
    errors: [...errors, ...missingFields.map(field => `${field} is required`)]
  };
};

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to register' },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Parse request body with error handling
    const body = await request.json().catch(() => null);
    
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    console.log('📦 Received registration payload:', body);

    // Validate the parsed data
    const validation = validateRegistrationData(body);

    if (validation.hasErrors) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: validation.errors
        },
        { status: 400 }
      );
    }

    // Check for duplicate registration
    const existingRegistration = await Registration.findOne({
      userId: new ObjectId(session.user.id),
      courseId: new ObjectId(body.courseId)
    });

    if (existingRegistration) {
      return NextResponse.json(
        {
          success: false,
          error: 'You have already registered for this course'
        },
        { status: 409 }
      );
    }

    // Create new registration with user ID
    const registration = new Registration({
      ...body,
      userId: new ObjectId(session.user.id), // Inject authenticated user ID
      disciplineId: new ObjectId(body.disciplineId),
      courseId: new ObjectId(body.courseId),
      selectedModules: body.selectedModules.map(id => new ObjectId(id))
    });

    // Save to database
    await registration.save();

    // Log successful registration
    console.log('✅ Registration saved successfully:', {
      id: registration._id,
      userId: registration.userId,
      courseId: registration.courseId,
      timestamp: registration.createdAt
    });

    // Return success response with populated module details
    const populatedRegistration = await Registration.findById(registration._id)
      .populate({
        path: 'selectedModules',
        model: Module,
        select: 'name code credits'
      })
      .lean();

    return NextResponse.json({
      success: true,
      message: 'Registration completed successfully',
      data: populatedRegistration
    });

  } catch (error) {
    console.error('❌ Registration error:', error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Duplicate registration detected'
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process registration'
      },
      { status: 500 }
    );
  }
} 