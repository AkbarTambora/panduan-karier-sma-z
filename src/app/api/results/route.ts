// src/app/api/results/route.ts
// API untuk menyimpan hasil tes ke database

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import type { UserProfile } from '@/lib/services/riasecService';
import type { RiasecType } from '@/data/riasecQuestions';

// ✅ Implementasi nanoid manual tanpa dependency tambahan
function generateId(length = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    const {
      testMode,
      scores,
      userProfile,
      nama,
      kelas,
      sekolah,
      isPublic = true,
    }: {
      testMode: 'quick' | 'full';
      scores: Record<RiasecType, number>;
      userProfile: UserProfile;
      nama: string;
      kelas: string;
      sekolah: string;
      isPublic?: boolean;
    } = body;

    if (!scores || !userProfile) {
      return NextResponse.json(
        { error: 'Data tes tidak lengkap' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'panduan-karier-db');

    // Generate ID unik untuk share link
    const sessionId = generateId(12);

    const resultDoc = {
      sessionId,
      userId: session?.user?.id || null, // null jika tidak login
      testMode,
      scores,
      userProfile: {
        personaName: userProfile.personaName,
        topThree: userProfile.topThree,
        topTwoCode: userProfile.topTwoCode,
        percentages: userProfile.percentages,
        scores: userProfile.scores,
      },
      // Data identitas — hanya disimpan jika user login atau mau berbagi
      displayName: session?.user?.name || nama || 'Anonim',
      school: session?.user?.school || sekolah || null,
      class: session?.user?.class || kelas || null,
      isPublic: session ? isPublic : false, // Hanya bisa publik jika login
      createdAt: new Date(),
    };

    const result = await db.collection('test_results').insertOne(resultDoc);

    // Buat index untuk performa query
    await db.collection('test_results').createIndex({ sessionId: 1 }, { unique: true });
    await db.collection('test_results').createIndex({ userId: 1 });
    await db.collection('test_results').createIndex({ isPublic: 1, createdAt: -1 });
    await db.collection('test_results').createIndex({ 'userProfile.topThree': 1 });

    return NextResponse.json({
      success: true,
      sessionId,
      resultId: result.insertedId.toString(),
      shareUrl: `/hasil/${sessionId}`,
    });

  } catch (error) {
    console.error('Error menyimpan hasil tes:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan hasil tes' },
      { status: 500 }
    );
  }
}
