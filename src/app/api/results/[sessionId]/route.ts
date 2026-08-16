// src/app/api/results/[sessionId]/route.ts
// GET satu hasil tes berdasarkan sessionId (share link)

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID diperlukan' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'panduan-karier-db');

    const result = await db.collection('test_results').findOne(
      { sessionId },
      {
        projection: {
          // Jangan tampilkan data sensitif
          userId: 0,
          _id: 0,
        }
      }
    );

    if (!result) {
      return NextResponse.json({ error: 'Hasil tes tidak ditemukan' }, { status: 404 });
    }

    // Hanya tampilkan jika publik atau milik user yang login
    if (!result.isPublic) {
      return NextResponse.json({ error: 'Hasil tes ini bersifat privat' }, { status: 403 });
    }

    return NextResponse.json({ success: true, result });

  } catch (error) {
    console.error('Error mengambil hasil tes:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data hasil tes' },
      { status: 500 }
    );
  }
}
