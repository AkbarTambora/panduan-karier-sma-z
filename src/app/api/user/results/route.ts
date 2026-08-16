// src/app/api/user/results/route.ts
// API untuk mengambil riwayat tes milik user yang sedang login

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Harus login terlebih dahulu' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'panduan-karier-db');

    const results = await db.collection('test_results')
      .find(
        { userId: session.user.id },
        {
          projection: {
            sessionId: 1,
            testMode: 1,
            'userProfile.personaName': 1,
            'userProfile.topThree': 1,
            'userProfile.topTwoCode': 1,
            'userProfile.percentages': 1,
            isPublic: 1,
            createdAt: 1,
          }
        }
      )
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json({ success: true, results });

  } catch (error) {
    console.error('Error mengambil riwayat tes:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil riwayat tes' },
      { status: 500 }
    );
  }
}

// PATCH: Update visibility (publik/privat) satu hasil tes
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Harus login terlebih dahulu' }, { status: 401 });
    }

    const { sessionId, isPublic } = await request.json();

    if (!sessionId || typeof isPublic !== 'boolean') {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'panduan-karier-db');

    const result = await db.collection('test_results').updateOne(
      { sessionId, userId: session.user.id }, // Pastikan hanya owner yang bisa update
      { $set: { isPublic, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Hasil tes tidak ditemukan atau bukan milik kamu' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: isPublic ? 'Hasil tes sekarang publik' : 'Hasil tes sekarang privat',
    });

  } catch (error) {
    console.error('Error update visibility:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate visibility' },
      { status: 500 }
    );
  }
}
