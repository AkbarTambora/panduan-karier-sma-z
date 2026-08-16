// src/components/dashboard/MemberDashboard.tsx
// Dashboard khusus pengguna yang sudah login (Portal Siswa)

import Link from 'next/link';
import clientPromise from '@/lib/mongodb';
import type { RiasecType } from '@/data/riasecQuestions';

const RIASEC_COLORS: Record<string, { bg: string; text: string; light: string; emoji: string }> = {
  R: { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50 border-orange-200', emoji: '🔧' },
  I: { bg: 'bg-blue-500', text: 'text-blue-700', light: 'bg-blue-50 border-blue-200', emoji: '🔬' },
  A: { bg: 'bg-purple-500', text: 'text-purple-700', light: 'bg-purple-50 border-purple-200', emoji: '🎨' },
  S: { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-50 border-green-200', emoji: '🤝' },
  E: { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50 border-red-200', emoji: '🚀' },
  C: { bg: 'bg-slate-500', text: 'text-slate-700', light: 'bg-slate-50 border-slate-200', emoji: '📋' },
};

interface MemberDashboardProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    school?: string | null;
    class?: string | null;
  };
}

export async function MemberDashboard({ user }: MemberDashboardProps) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME || 'panduan-karier-db');

  // Ambil tes terakhir user dan total tes
  const [latestTest, totalUserTests, recentPublicTests] = await Promise.all([
    db.collection('test_results')
      .find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray(),
    db.collection('test_results').countDocuments({ userId: user.id }),
    db.collection('test_results')
      .find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray(),
  ]);

  const lastResult = latestTest[0];

  return (
    <main className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* 1. Header Sambutan Personal */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
              {user.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                  Halo, {user.name}! 👋
                </h1>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {[user.class, user.school].filter(Boolean).join(' • ') || 'Siswa SMA'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Link
              href="/tes/mulai"
              className="flex-1 sm:flex-none px-5 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 text-center"
            >
              ⚡ Mulai Tes Baru
            </Link>
          </div>
        </div>

        {/* 2. Kartu Hasil Terakhir vs Ajakan Tes Pertama */}
        {lastResult ? (
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                Hasil Analisis Terakhirmu
              </span>
              <span className="text-xs text-blue-100">
                {new Date(lastResult.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <h2 className="text-3xl sm:text-4xl font-black">
                  {lastResult.userProfile?.personaName}
                </h2>
                <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                  <span className="text-xs text-blue-200">Kombinasi Dominan:</span>
                  {lastResult.userProfile?.topThree?.map((t: RiasecType) => (
                    <span key={t} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-sm text-white">
                      {RIASEC_COLORS[t]?.emoji} {t}
                    </span>
                  ))}
                  <span className="text-xs bg-white/10 px-2.5 py-1 rounded-lg text-blue-100">
                    Mode: {lastResult.testMode === 'quick' ? '⚡ Quick (18 soal)' : '📊 Lengkap (90 soal)'}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5">
                <Link
                  href={`/hasil/${lastResult.sessionId}`}
                  className="px-5 py-3 bg-white text-blue-900 font-bold text-sm rounded-xl text-center hover:bg-blue-50 transition-all shadow-md"
                >
                  Lihat Detail Hasil &amp; Rekomendasi →
                </Link>
                <Link
                  href="/riwayat"
                  className="px-5 py-2.5 bg-white/10 border border-white/20 text-white font-semibold text-xs rounded-xl text-center hover:bg-white/20 transition-colors"
                >
                  Buka Semua Riwayat ({totalUserTests} Tes)
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-blue-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mx-auto">
              🎯
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Belum Mengambil Tes</h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                Kenali 3 tipe kepribadian dominanmu dan dapatkan kurasi jurusan serta karier yang paling sesuai.
              </p>
            </div>
            <Link
              href="/tes/mulai"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md"
            >
              <span>Mulai Tes Sekarang (Gratis)</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}

        {/* 3. Fitur Cepat (Navigation Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/explore"
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                🌐
              </div>
              <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                Explore Komunitas
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Lihat hasil tes siswa lain dari berbagai sekolah, filter berdasarkan tipe kepribadian RIASEC.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-600 mt-4 inline-flex items-center space-x-1">
              <span>Buka Explore</span>
              <span>→</span>
            </span>
          </Link>

          <Link
            href="/riwayat"
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                📋
              </div>
              <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                Riwayat &amp; Share Link
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Kelola hasil tesmu, atur status visibilitas (publik/privat), dan bagikan link hasil ke orang lain.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 mt-4 inline-flex items-center space-x-1">
              <span>{totalUserTests} Tes Tersimpan</span>
              <span>→</span>
            </span>
          </Link>

          <Link
            href="/tes/mulai"
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                Ambil Tes Baru
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Pilih antara Quick Test (18 soal) atau Tes Lengkap (90 soal) untuk pemutakhiran minat dan bakatmu.
              </p>
            </div>
            <span className="text-xs font-bold text-green-600 mt-4 inline-flex items-center space-x-1">
              <span>Mulai Kuesioner</span>
              <span>→</span>
            </span>
          </Link>
        </div>

        {/* 4. Live Feed Singkat dari Explore */}
        {recentPublicTests.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Aktivitas Terkini Siswa Lain</h2>
                <p className="text-xs text-slate-500">Hasil tes publik yang baru saja diselesaikan</p>
              </div>
              <Link href="/explore" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                Lihat Semua ({recentPublicTests.length}+) →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {recentPublicTests.map((item) => {
                const topType = item.userProfile?.topThree?.[0] as RiasecType;
                const colors = RIASEC_COLORS[topType] || RIASEC_COLORS.C;
                return (
                  <Link
                    key={item.sessionId}
                    href={`/hasil/${item.sessionId}`}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition-all block group"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{colors.emoji}</span>
                      <span className="font-bold text-slate-800 text-xs truncate group-hover:text-blue-600">
                        {item.userProfile?.personaName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {item.displayName} • {item.school || 'SMA'}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
