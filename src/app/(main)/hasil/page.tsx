// Lokasi file: src/app/(main)/hasil/page.tsx

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAnalysisReport, type MatchResult } from '@/lib/services/riasecService';
import { riasecDetails } from '@/data/riasecDescriptions';
import { HexagonChart } from '@/components/results/HexagonChart';
import type { RiasecType } from '@/data/riasecQuestions';
import ReactMarkdown from 'react-markdown';

const riasecColors = {
  R: {
    bg: 'bg-orange-500',
    text: 'text-orange-800',
    bgLight: 'bg-orange-100',
  },
  I: {
    bg: 'bg-blue-500',
    text: 'text-blue-800',
    bgLight: 'bg-blue-100',
  },
  A: {
    bg: 'bg-purple-500',
    text: 'text-purple-800',
    bgLight: 'bg-purple-100',
  },
  S: {
    bg: 'bg-green-500',
    text: 'text-green-800',
    bgLight: 'bg-green-100',
  },
  E: {
    bg: 'bg-red-500',
    text: 'text-red-800',
    bgLight: 'bg-red-100',
  },
  C: {
    bg: 'bg-slate-500',
    text: 'text-slate-800',
    bgLight: 'bg-slate-100',
  },
};

// Tipe untuk props halaman tidak berubah
type HasilPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
  // =================================================================
  // LANGKAH #1: TUNGGU 'searchParams' SELESAI
  // =================================================================
  const resolvedSearchParams = await searchParams;

  // =================================================================
  // LANGKAH #2: SEKARANG KITA BISA PROSES SEPERTI BIASA
  // =================================================================
  const RIASEC_TYPES: RiasecType[] = ['R', 'I', 'A', 'S', 'E', 'C'];
  
  const namaValue = resolvedSearchParams.nama;
  const nama = Array.isArray(namaValue) ? namaValue[0] : namaValue || 'Siswa';

  const kelasValue = resolvedSearchParams.kelas;
  const kelas = Array.isArray(kelasValue) ? kelasValue[0] : kelasValue || 'Kelas';
  
  const sekolahValue = resolvedSearchParams.sekolah;
  const sekolah = Array.isArray(sekolahValue) ? sekolahValue[0] : sekolahValue || 'Sekolah';

  const riasecScores: { [key: string]: string } = {};
  for (const key of RIASEC_TYPES) {
    const scoreValue = resolvedSearchParams[key];
    if (scoreValue && typeof scoreValue === 'string') {
      riasecScores[key] = scoreValue;
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
                  {/* --- UBAH WARNA PERSENTASE --- */}
                  <span className={`text-sm font-medium ${riasecColors[type].text}`}>{percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  {/* --- UBAH WARNA BAR --- */}
                  <div 
                    className={`h-2.5 rounded-full ${riasecColors[type].bg}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg h-full flex flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-bold text-slate-700 text-center">Peta Minatmu</h2>
          <HexagonChart 
            percentages={userProfile.percentages} 
            topThree={userProfile.topThree} 
            colors={riasecColors} 
          />
        </div>
      </section>

      {/* Bagian Rekomendasi */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rekomendasi Jurusan */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Rekomendasi Jurusan</h2>
          </div>
          {majorMatches.map((major: MatchResult) => (
            <div key={major.id} className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-slate-900">{major.name}</h3>
                {/* --- UBAH WARNA BADGE --- */}
                <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${riasecColors[major.matchedType].bgLight} ${riasecColors[major.matchedType].text}`}>
                  Sesuai Minat {riasecDetails[major.matchedType].name.replace(/\s\(.*\)/, '')}
                </span>
              </div>
              <p className="mt-2 text-slate-600">{major.description}</p>
               
              <MatchMeter 
                score={major.matchScore} 
                colorClass={riasecColors[major.matchedType].bg} // <-- Berikan warna yang sesuai
              />
              
              <p className="mt-3 text-xs text-slate-400">
                Profil Jurusan: {Object.entries(major.riasecProfile).map(([t, s]) => `${t}:${s}`).join(', ')}
              </p>
            </div>
          ))}
        </div>
        {/* Rekomendasi Karier */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 text-green-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Rekomendasi Karier</h2>
          </div>
          {careerMatches.map((career: MatchResult) => (
            <div key={career.id} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-slate-900">{career.name}</h3>
                {/* --- UBAH WARNA BADGE --- */}
                <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${riasecColors[career.matchedType].bgLight} ${riasecColors[career.matchedType].text}`}>
                  Sesuai Minat {riasecDetails[career.matchedType].name.replace(/\s\(.*\)/, '')}
                </span>
              </div>
              <p className="mt-2 text-slate-600">{career.description}</p>
              
              <MatchMeter 
                score={career.matchScore} 
                colorClass={riasecColors[career.matchedType].bg} // <-- Berikan warna yang sesuai
              />
              
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

function MatchMeter({ score, colorClass }: { score: number; colorClass: string }) {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-slate-600">Tingkat Kecocokan</span>
        {/* Kita bisa membuat teks persentasenya juga berwarna */}
        <span className={`text-sm font-bold ${colorClass.replace('bg-', 'text-')}`}>{score}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          // Hapus gradasi, gunakan warna solid dari props
          className={`h-2 rounded-full ${colorClass}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}

