// src/app/(main)/riwayat/page.tsx
// Halaman riwayat tes milik user yang sedang login

import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import Link from 'next/link';
import { RiwayatClient } from './RiwayatClient';

export default async function RiwayatPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/riwayat');
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

  // Serialize untuk client component
  const serializedResults = results.map(r => ({
    sessionId: r.sessionId as string,
    testMode: r.testMode as 'quick' | 'full',
    userProfile: r.userProfile as {
      personaName: string;
      topThree: import('@/data/riasecQuestions').RiasecType[];
      topTwoCode: string;
      percentages: [import('@/data/riasecQuestions').RiasecType, number][];
    },
    isPublic: r.isPublic as boolean,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Riwayat Tes</h1>
          <p className="text-slate-500 mt-1">
            Halo, <span className="font-semibold text-blue-600">{session.user.name}</span>! Berikut semua hasil tes RIASEC kamu.
          </p>
        </div>

        {serializedResults.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Belum Ada Riwayat</h2>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              Kamu belum pernah mengambil tes RIASEC. Mulai tes sekarang untuk melihat hasilnya di sini!
            </p>
            <Link
              href="/tes/mulai"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Mulai Tes Sekarang</span>
            </Link>
          </div>
        ) : (
          <RiwayatClient results={serializedResults} />
        )}
      </div>
    </main>
  );
}
