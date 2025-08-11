// src/app/api/feedback/route.ts

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { 
      userProfile, 
      topRecommendations, 
      feedback, 
      timestamp 
    } = body;
    
    if (!feedback.accuracy || !feedback.satisfaction) {
      return NextResponse.json(
        { error: 'Accuracy and satisfaction ratings are required' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const mongoClient = await clientPromise;
    const dbName = process.env.MONGODB_DB_NAME || "panduan-karier-db";
    const db = mongoClient.db(dbName);
    
    // Create feedback document
    const feedbackDoc = {
      userProfile: {
        personaName: userProfile.personaName,
        topThree: userProfile.topThree
      },
      topRecommendations,
      feedback: {
        accuracy: Number(feedback.accuracy),
        satisfaction: Number(feedback.satisfaction),
        mostInteresting: feedback.mostInteresting || '',
        additionalComments: feedback.additionalComments || ''
      },
      metadata: {
        timestamp: new Date(timestamp),
        userAgent: request.headers.get('user-agent') || 'unknown',
        // ✅ FIXED: Get IP address from headers instead of request.ip
        ip: request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown'
      },
      createdAt: new Date()
    };
    
    // Insert feedback into database
    const result = await db.collection('feedback').insertOne(feedbackDoc);
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Feedback berhasil disimpan',
      feedbackId: result.insertedId
    });
    
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan feedback. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}

// GET endpoint untuk analytics (optional, untuk admin)
export async function GET() {
  // ✅ FIXED: Removed unused 'request' parameter
  try {
    const mongoClient = await clientPromise;
    const dbName = process.env.MONGODB_DB_NAME || "panduan-karier-db";
    const db = mongoClient.db(dbName);
    
    // Get basic feedback statistics
    const totalFeedback = await db.collection('feedback').countDocuments();
    
    const averageRatings = await db.collection('feedback').aggregate([
      {
        $group: {
          _id: null,
          avgAccuracy: { $avg: '$feedback.accuracy' },
          avgSatisfaction: { $avg: '$feedback.satisfaction' },
          totalResponses: { $sum: 1 }
        }
      }
    ]).toArray();
    
    // Most popular recommendations
    const popularRecommendations = await db.collection('feedback').aggregate([
      { $unwind: '$topRecommendations.majors' },
      { 
        $group: { 
          _id: '$topRecommendations.majors', 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();
    
    return NextResponse.json({
      success: true,
      analytics: {
        totalFeedback,
        averageRatings: averageRatings[0] || { avgAccuracy: 0, avgSatisfaction: 0, totalResponses: 0 },
        popularRecommendations
      }
    });
    
  } catch (error) {
    console.error('Error fetching feedback analytics:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data analytics' },
      { status: 500 }
    );
  }
}