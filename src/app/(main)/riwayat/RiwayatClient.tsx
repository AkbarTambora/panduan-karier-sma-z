// src/app/(main)/riwayat/RiwayatClient.tsx
// Client component untuk interaksi toggle public/private

'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { RiasecType } from '@/data/riasecQuestions';

const RIASEC_COLORS: Record<string, { bg: string; text: string; light: string; emoji: string }> = {
  R: { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50 border-orange-200', emoji: '🔧' },
  I: { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50 border-blue-200', emoji: '🔬' },
  A: { bg: 'bg-purple-500', text: 'text-purple-700', light: 'bg-purple-50 border-purple-200', emoji: '🎨' },
  S: { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-50 border-green-200', emoji: '🤝' },
  E: { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50 border-red-200', emoji: '🚀' },
  C: { bg: 'bg-slate-500', text: 'text-slate-700', light: 'bg-slate-50 border-slate-200', emoji: '📋' },
};

interface TestResult {
  sessionId: string;
  testMode: 'quick' | 'full';
  userProfile: {
    personaName: string;
    topThree: RiasecType[];
    topTwoCode: string;
    percentages: [RiasecType, number][];
  };
  isPublic: boolean;
  createdAt: string;
}

export function RiwayatClient({ results: initialResults }: { results: TestResult[] }) {
  const [results, setResults] = useState(initialResults);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleVisibility = async (sessionId: string, currentIsPublic: boolean) => {
    setLoadingId(sessionId);
    try {
      const res = await fetch('/api/user/results', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, isPublic: !currentIsPublic }),
      });
      if (res.ok) {
        setResults(prev =>
          prev.map(r => r.sessionId === sessionId ? { ...r, isPublic: !currentIsPublic } : r)
        );
      }
    } catch {
      console.error('Gagal update visibility');
    } finally {
      setLoadingId(null);
    }
  };

  const copyShareLink = async (sessionId: string) => {
    const url = `${window.location.origin}/hasil/${sessionId}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(sessionId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* Stats Header */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-3xl font-bold text-blue-600">{results.length}</p>
          <p className="text-sm text-slate-500 mt-0.5">Total Tes</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-3xl font-bold text-green-600">
            {results.filter(r => r.testMode === 'full').length}
          </p>
          <p className="text-sm text-slate-500 mt-0.5">Tes Lengkap</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center col-span-2 sm:col-span-1">
          <p className="text-3xl font-bold text-purple-600">
            {results.filter(r => r.isPublic).length}
          </p>
          <p className="text-sm text-slate-500 mt-0.5">Dibagikan</p>
        </div>
      </div>

      {/* Result Cards */}
      {results.map((result, index) => {
        const topType = result.userProfile.topThree[0];
        const colors = RIASEC_COLORS[topType] || RIASEC_COLORS.C;
        const isLatest = index === 0;

        return (
          <div
            key={result.sessionId}
            className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all ${
              isLatest ? 'border-blue-200 ring-1 ring-blue-100' : 'border-slate-100'
            }`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-4 flex-1 min-w-0">
                  {/* Type Badge */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${colors.light} border`}>
                    {colors.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800">{result.userProfile.personaName}</h3>
                      {isLatest && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                          Terbaru
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        result.testMode === 'full'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-green-50 text-green-700'
                      }`}>
                        {result.testMode === 'full' ? '📊 Lengkap' : '⚡ Quick'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {result.userProfile.topThree.map(type => (
                        <span key={type} className={`text-xs font-bold px-2 py-0.5 rounded ${RIASEC_COLORS[type]?.light} ${RIASEC_COLORS[type]?.text} border`}>
                          {type}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">{formatDate(result.createdAt)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                  {/* Toggle Public */}
                  <button
                    onClick={() => toggleVisibility(result.sessionId, result.isPublic)}
                    disabled={loadingId === result.sessionId}
                    title={result.isPublic ? 'Jadikan Privat' : 'Jadikan Publik'}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      result.isPublic
                        ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                        : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                    } disabled:opacity-50`}
                  >
                    {loadingId === result.sessionId ? (
                      <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
                    ) : (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {result.isPublic
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        }
                      </svg>
                    )}
                    <span>{result.isPublic ? 'Publik' : 'Privat'}</span>
                  </button>

                  {/* Copy Share Link — hanya jika publik */}
                  {result.isPublic && (
                    <button
                      onClick={() => copyShareLink(result.sessionId)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all"
                    >
                      {copiedId === result.sessionId ? (
                        <>
                          <svg className="h-3.5 w-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-600">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          <span>Bagikan</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* View */}
                  <Link
                    href={`/hasil/${result.sessionId}`}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-all"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Lihat</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* CTA */}
      <div className="pt-4 text-center">
        <Link
          href="/tes/mulai"
          className="inline-flex items-center space-x-2 px-6 py-3 border-2 border-blue-200 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Ulangi Tes</span>
        </Link>
      </div>
    </div>
  );
}
