// src/app/(main)/explore/ExploreClient.tsx
// Grid card untuk halaman explore

'use client';

import Link from 'next/link';
import type { RiasecType } from '@/data/riasecQuestions';

const RIASEC_COLORS: Record<string, { bg: string; text: string; light: string }> = {
  R: { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50 border-orange-200' },
  I: { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50 border-blue-200' },
  A: { bg: 'bg-purple-500', text: 'text-purple-700', light: 'bg-purple-50 border-purple-200' },
  S: { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-50 border-green-200' },
  E: { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50 border-red-200' },
  C: { bg: 'bg-slate-500', text: 'text-slate-700', light: 'bg-slate-50 border-slate-200' },
};

interface ExploreResult {
  sessionId: string;
  displayName: string;
  school?: string;
  class?: string;
  testMode: 'quick' | 'full';
  userProfile: {
    personaName: string;
    topThree: RiasecType[];
    topTwoCode: string;
    percentages: [RiasecType, number][];
  };
  createdAt: string;
}

export function ExploreClient({
  results,
  filterType,
  typeLabels,
}: {
  results: ExploreResult[];
  filterType?: string;
  typeLabels: Record<string, { label: string; emoji: string }>;
}) {
  if (results.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-slate-700 mb-2">
          {filterType ? `Belum Ada Hasil untuk Tipe ${filterType}` : 'Belum Ada Hasil Publik'}
        </h2>
        <p className="text-slate-500 mb-6">
          {filterType
            ? 'Coba filter tipe lain atau lihat semua hasil.'
            : 'Jadilah yang pertama membagikan hasil tesmu!'}
        </p>
        <Link
          href="/tes/mulai"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md"
        >
          <span>Mulai Tes Sekarang</span>
        </Link>
      </div>
    );
  }

  const formatTimeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    return `${days} hari lalu`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((result) => {
        const topType = result.userProfile.topThree[0];
        const colors = RIASEC_COLORS[topType] || RIASEC_COLORS.C;
        const topPercentages = result.userProfile.percentages?.slice(0, 3) || [];

        return (
          <Link
            key={result.sessionId}
            href={`/hasil/${result.sessionId}`}
            className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            {/* Color bar per tipe dominan */}
            <div className={`h-1.5 w-full ${colors.bg}`} />
            
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors.light} border shrink-0`}>
                    {typeLabels[topType]?.emoji || '🎯'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm leading-tight truncate group-hover:text-blue-700 transition-colors">
                      {result.userProfile.personaName}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {result.displayName}
                      {result.school && ` · ${result.school}`}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                  result.testMode === 'full' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                }`}>
                  {result.testMode === 'full' ? '📊' : '⚡'}
                </span>
              </div>

              {/* RIASEC Type Badges */}
              <div className="flex items-center space-x-1.5 mb-4">
                {result.userProfile.topThree.map((type, i) => (
                  <span
                    key={type}
                    className={`text-xs font-bold px-2 py-1 rounded-lg border ${RIASEC_COLORS[type]?.light} ${RIASEC_COLORS[type]?.text} ${i === 0 ? 'ring-1 ring-offset-0' : ''}`}
                  >
                    {type}
                  </span>
                ))}
              </div>

              {/* Mini Bar Chart — top 3 percentages */}
              <div className="space-y-1.5">
                {topPercentages.map(([type, pct]) => (
                  <div key={type} className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-500 w-4">{type}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${RIASEC_COLORS[type]?.bg}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                <span className="text-xs text-slate-400">{formatTimeAgo(result.createdAt)}</span>
                <span className="text-xs text-blue-500 group-hover:text-blue-700 font-medium flex items-center space-x-1">
                  <span>Lihat detail</span>
                  <svg className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
