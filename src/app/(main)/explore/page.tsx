// src/app/(main)/explore/page.tsx
// Halaman Explore — lihat hasil tes publik dari semua user

import { Suspense } from 'react';
import clientPromise from '@/lib/mongodb';
import { ExploreClient } from './ExploreClient';
import type { RiasecType } from '@/data/riasecQuestions';

const RIASEC_TYPES: RiasecType[] = ['R', 'I', 'A', 'S', 'E', 'C'];
const TYPE_LABELS: Record<RiasecType, { label: string; emoji: string }> = {
  R: { label: 'Realistis', emoji: '🔧' },
  I: { label: 'Pemikir', emoji: '🔬' },
  A: { label: 'Kreatif', emoji: '🎨' },
  S: { label: 'Penolong', emoji: '🤝' },
  E: { label: 'Pengusaha', emoji: '🚀' },
  C: { label: 'Teratur', emoji: '📋' },
};

async function getExploreData(filterType?: string) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME || 'panduan-karier-db');

  const query: Record<string, unknown> = { isPublic: true };
  if (filterType && RIASEC_TYPES.includes(filterType as RiasecType)) {
    query['userProfile.topThree'] = { $in: [filterType] };
  }

  const [results, total, typeCounts] = await Promise.all([
    db.collection('test_results')
      .find(query, {
        projection: {
          sessionId: 1, displayName: 1, school: 1, class: 1, testMode: 1,
          'userProfile.personaName': 1, 'userProfile.topThree': 1,
          'userProfile.topTwoCode': 1, 'userProfile.percentages': 1,
          createdAt: 1, _id: 0,
        }
      })
      .sort({ createdAt: -1 })
      .limit(24)
      .toArray(),
    db.collection('test_results').countDocuments({ isPublic: true }),
    // Hitung per tipe RIASEC untuk filter
    Promise.all(
      RIASEC_TYPES.map(type =>
        db.collection('test_results')
          .countDocuments({ isPublic: true, 'userProfile.topThree': { $in: [type] } })
          .then(count => ({ type, count }))
      )
    ),
  ]);

  return {
    results: results.map(r => ({
      ...r,
      _id: undefined,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    })) as unknown as Array<{
      sessionId: string; displayName: string; school?: string; class?: string;
      testMode: 'quick' | 'full'; userProfile: { personaName: string; topThree: RiasecType[]; topTwoCode: string; percentages: [RiasecType, number][]; };
      createdAt: string;
    }>,
    total,
    typeCounts: Object.fromEntries(typeCounts.map(({ type, count }) => [type, count])),
  };
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type: filterType } = await searchParams;
  const { results, total, typeCounts } = await getExploreData(filterType);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Explore</h1>
              <p className="text-slate-500 text-sm">
                <span className="font-semibold text-blue-600">{total}</span> hasil tes publik dari siswa-siswa lain
              </p>
            </div>
          </div>

          {/* Filter by RIASEC Type */}
          <div className="flex flex-wrap gap-2 mt-5">
            <a
              href="/explore"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                !filterType
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Semua ({total})
            </a>
            {RIASEC_TYPES.map((type) => (
              <a
                key={type}
                href={`/explore?type=${type}`}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filterType === type
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                }`}
              >
                {TYPE_LABELS[type].emoji} {TYPE_LABELS[type].label}
                <span className="ml-1.5 text-xs opacity-70">({typeCounts[type] || 0})</span>
              </a>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <Suspense fallback={<ExploreGridSkeleton />}>
          <ExploreClient results={results} filterType={filterType} typeLabels={TYPE_LABELS} />
        </Suspense>
      </div>
    </main>
  );
}

function ExploreGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-slate-200 rounded-xl" />
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          </div>
          <div className="h-16 bg-slate-100 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
