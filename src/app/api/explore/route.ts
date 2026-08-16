// src/app/api/explore/route.ts
// API untuk halaman explore — ambil hasil tes publik dari semua user

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import type { RiasecType } from '@/data/riasecQuestions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filterType = searchParams.get('type') as RiasecType | null; // Filter by RIASEC type
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(20, parseInt(searchParams.get('limit') || '12'));
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'panduan-karier-db');

    // Build query
    const query: Record<string, unknown> = { isPublic: true };
    if (filterType) {
      query['userProfile.topThree'] = { $in: [filterType] };
    }

    const [results, total] = await Promise.all([
      db.collection('test_results')
        .find(query, {
          projection: {
            sessionId: 1,
            displayName: 1,
            school: 1,
            class: 1,
            testMode: 1,
            'userProfile.personaName': 1,
            'userProfile.topThree': 1,
            'userProfile.topTwoCode': 1,
            'userProfile.percentages': 1,
            createdAt: 1,
            _id: 0,
          }
        })
        .sort({ createdAt: -1 }) // Terbaru duluan
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection('test_results').countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Error mengambil data explore:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data explore' },
      { status: 500 }
    );
  }
}
