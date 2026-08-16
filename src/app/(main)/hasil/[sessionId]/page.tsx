// src/app/(main)/hasil/[sessionId]/page.tsx
// View read-only hasil tes dari share link

import { notFound } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import { riasecDetails } from '@/data/riasecDescriptions';
import { HexagonChart } from '@/components/results/HexagonChart';
import Link from 'next/link';
import type { RiasecType } from '@/data/riasecQuestions';

const RIASEC_COLORS = {
  R: { bg: 'bg-orange-500', text: 'text-orange-800', bgLight: 'bg-orange-100' },
  I: { bg: 'bg-blue-500', text: 'text-blue-800', bgLight: 'bg-blue-100' },
  A: { bg: 'bg-purple-500', text: 'text-purple-800', bgLight: 'bg-purple-100' },
  S: { bg: 'bg-green-500', text: 'text-green-800', bgLight: 'bg-green-100' },
  E: { bg: 'bg-red-500', text: 'text-red-800', bgLight: 'bg-red-100' },
  C: { bg: 'bg-slate-500', text: 'text-slate-800', bgLight: 'bg-slate-100' },
};

const TYPE_EMOJIS: Record<RiasecType, string> = {
  R: '🔧', I: '🔬', A: '🎨', S: '🤝', E: '🚀', C: '📋',
};

export default async function SharedResultPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME || 'panduan-karier-db');

  const result = await db.collection('test_results').findOne(
    { sessionId },
    { projection: { userId: 0 } }
  );

  if (!result || !result.isPublic) {
    notFound();
  }

  const { userProfile, displayName, school, class: userClass, testMode } = result;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-8">
        {/* Shared Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <div>
              <p className="font-bold text-sm">Hasil Tes Dibagikan</p>
              <p className="text-blue-100 text-xs">
                {testMode === 'quick' ? '⚡ Quick Test (18 soal)' : '📊 Tes Lengkap (90 soal)'}
              </p>
            </div>
          </div>
          <Link
            href="/tes/mulai"
            className="shrink-0 px-4 py-2 bg-white text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors"
          >
            Coba Juga →
          </Link>
        </div>

        {/* Header */}
        <header className="text-center border-b-2 border-slate-200 pb-8">
          <p className="text-2xl font-bold text-slate-800 mb-1">{displayName}</p>
          {(school || userClass) && (
            <p className="text-lg text-slate-600">
              {[userClass, school].filter(Boolean).join(' · ')}
            </p>
          )}
        </header>

        {/* Persona */}
        <section className="text-center">
          <div className="flex justify-center space-x-2 mb-4">
            {userProfile.topThree?.map((type: RiasecType) => (
              <span key={type} className={`text-2xl px-3 py-1 rounded-xl ${RIASEC_COLORS[type]?.bgLight} ${RIASEC_COLORS[type]?.text} font-bold border`}>
                {TYPE_EMOJIS[type]} {type}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">
            {userProfile.personaName}
          </h1>
          <p className="text-slate-500 text-sm mt-2">Kode RIASEC: <span className="font-bold text-blue-600">{userProfile.topTwoCode}</span></p>
        </section>

        {/* Profil Minat + Hexagon */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-700 mb-4">Profil Minat</h2>
            <div className="space-y-3">
              {userProfile.percentages?.map(([type, pct]: [RiasecType, number]) => (
                <div key={type}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700 flex items-center space-x-1.5">
                      <span>{TYPE_EMOJIS[type]}</span>
                      <span>{riasecDetails[type]?.name.replace(/\s\(.*\)/, '')}</span>
                    </span>
                    <span className={`text-sm font-bold ${RIASEC_COLORS[type]?.text}`}>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${RIASEC_COLORS[type]?.bg}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <h2 className="text-lg font-bold text-slate-700 mb-4">Peta Minat</h2>
            <HexagonChart
              percentages={userProfile.percentages || []}
              topThree={userProfile.topThree || []}
              colors={RIASEC_COLORS}
            />
          </div>
        </section>

        {/* Top 3 Description */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Karakteristik Dominan</h2>
          {userProfile.topThree?.slice(0, 2).map((type: RiasecType) => {
            const detail = riasecDetails[type];
            const colors = RIASEC_COLORS[type];
            return (
              <div key={type} className={`p-5 rounded-xl border ${colors.bgLight} border-opacity-50`}>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{TYPE_EMOJIS[type]}</span>
                  <h3 className={`font-bold ${colors.text}`}>{detail?.name}</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{detail?.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {detail?.keywords?.map(kw => (
                    <span key={kw} className={`text-xs px-2 py-0.5 rounded-full ${colors.bgLight} ${colors.text} border font-medium`}>{kw}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Penasaran dengan Hasilmu?</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Temukan persona RIASEC kamu sendiri dan dapatkan rekomendasi jurusan &amp; karier yang personal.
          </p>
          <Link
            href="/tes/mulai"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md shadow-blue-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Mulai Tes Sekarang — Gratis!</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
