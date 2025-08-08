// Lokasi file: src/app/(main)/hasil/page.tsx

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAnalysisReport, type MatchResult } from '@/lib/services/riasecService';
import { riasecDetails } from '@/data/riasecDescriptions';
import { HexagonChart } from '@/components/results/HexagonChart';
import type { RiasecType } from '@/data/riasecQuestions';
import ReactMarkdown from 'react-markdown';

// Tipe untuk props halaman tidak berubah
type HasilPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

// Komponen Halaman Utama (Server Component)
export default async function HasilPage({ searchParams }: HasilPageProps) {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        <Suspense fallback={<LoadingSkeleton />}>
          <HasilContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

// Komponen Konten Inti (Server Component)
async function HasilContent({ searchParams }: HasilPageProps) {
  // Gunakan URLSearchParams untuk cara yang lebih aman dalam mengelola parameter URL
  const params = new URLSearchParams(searchParams as Record<string, string>);

  // Ambil data personal dari URL
  const nama = params.get('nama') || 'Siswa';
  const kelas = params.get('kelas') || 'Kelas';
  const sekolah = params.get('sekolah') || 'Sekolah';

  // Siapkan objek untuk menampung skor
  const riasecScores: { [key: string]: string } = {};
  const RIASEC_TYPES: RiasecType[] = ['R', 'I', 'A', 'S', 'E', 'C'];

  // Loop melalui tipe RIASEC untuk mengambil skor dari parameter URL
  for (const key of RIASEC_TYPES) {
    const value = params.get(key);
    if (value) {
      riasecScores[key] = value;
    }
  }

  // Pengaman: Jika tidak ada skor sama sekali, kembalikan ke halaman awal
  if (Object.keys(riasecScores).length === 0) {
    redirect('/tes/mulai');
  }

  // Panggil service untuk mendapatkan laporan analisis lengkap
  const report = await getAnalysisReport(riasecScores);
  const { userProfile, majorMatches, careerMatches, motivation } = report;

  // Render JSX
  return (
    <div className="space-y-10">
      {/* Bagian Header Personal */}
      <header className="text-center border-b-2 border-slate-200 pb-8">
        <p className="text-2xl font-bold text-slate-800 mb-1">{nama}</p>
        <p className="text-lg text-slate-600">{kelas} - {sekolah}</p>
      </header>

      {/* Bagian Analisis Kepribadian */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
          Analisis Kepribadian <br />
          <span className="text-blue-600">{userProfile.personaName}</span>
        </h1>
        <div className="mt-4 max-w-3xl mx-auto text-lg text-slate-600">
          <ReactMarkdown>{motivation}</ReactMarkdown>
        </div>
      </section>

      {/* Bagian Visualisasi Data */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-slate-700 mb-4 text-center">Profil Minatmu</h2>
          <div className="space-y-3">
            {userProfile.percentages.map(([type, percentage]: [RiasecType, number]) => (
              <div key={type}>
                <div className="flex justify-between mb-1">
                  <span className="text-base font-medium text-slate-700">{riasecDetails[type].name.replace(/\s\(.*\)/, '')}</span>
                  <span className="text-sm font-medium text-blue-700">{percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg h-full flex flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-bold text-slate-700 text-center">Peta Minatmu</h2>
          <HexagonChart percentages={userProfile.percentages} topThree={userProfile.topThree} />
        </div>
      </section>

      {/* Bagian Rekomendasi */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rekomendasi Jurusan */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">Rekomendasi Jurusan</h2>
          {majorMatches.map((major: MatchResult) => (
            <div key={major.id} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-slate-900">{major.name}</h3>
                <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full whitespace-nowrap">
                  Sesuai Minat {riasecDetails[major.matchedType].name.replace(/\s\(.*\)/, '')}
                </span>
              </div>
              <p className="mt-2 text-slate-600">{major.description}</p>
              <p className="mt-3 text-xs text-slate-400">
                Profil Jurusan: {Object.entries(major.riasecProfile).map(([t, s]) => `${t}:${s}`).join(', ')}
              </p>
            </div>
          ))}
        </div>
        {/* Rekomendasi Karier */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">Rekomendasi Karier</h2>
          {careerMatches.map((career: MatchResult) => (
            <div key={career.id} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-slate-900">{career.name}</h3>
                <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full whitespace-nowrap">
                  Sesuai Minat {riasecDetails[career.matchedType].name.replace(/\s\(.*\)/, '')}
                </span>
              </div>
              <p className="mt-2 text-slate-600">{career.description}</p>
              <p className="mt-3 text-xs text-slate-400">
                Profil Karier: {Object.entries(career.riasecProfile).map(([t, s]) => `${t}:${s}`).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function LoadingSkeleton() {
  return <div className="text-center p-12 text-lg font-semibold">Menganalisis jawabanmu...</div>;
}