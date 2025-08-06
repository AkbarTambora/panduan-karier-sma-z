// src/app/(main)/hasil/page.tsx
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
// --- PERBAIKAN: Impor tipe-tipe yang dibutuhkan ---
import { getAnalysisReport, type MatchResult} from '@/lib/services/riasecService';
import { riasecDetails } from '@/data/riasecDescriptions';
import { HexagonChart } from '@/components/results/HexagonChart';
import type { RiasecType } from '@/data/riasecQuestions'; 
import ReactMarkdown from 'react-markdown'; 


// Tipe untuk searchParams
type HasilPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HasilPage({ searchParams }: HasilPageProps) {
  // Biarkan halaman utama tetap ramping
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

// JADIKAN KOMPONEN INI ASYNC
async function HasilContent({ searchParams }: HasilPageProps) {
  // --- PERBAIKAN: AWAIT searchParams terlebih dahulu ---
  const params = await searchParams;
  
  // 1. Destrukturisasi dari params yang sudah di-await
  const { R, I, A, S, E, C } = params;
  const potentialScores = { R, I, A, S, E, C };
  
  const riasecScores: { [key: string]: string } = {};
  const RIASEC_TYPES = ['R', 'I', 'A', 'S', 'E', 'C'];
  
  // 2. Lakukan iterasi pada objek `potentialScores` yang sudah aman.
  for (const key of RIASEC_TYPES) {
    const value = potentialScores[key as keyof typeof potentialScores]; 
    if (value && typeof value === 'string') {
      riasecScores[key] = value;
    }
  }

  // 3. Validasi dan logika selanjutnya tidak perlu diubah
  if (Object.keys(riasecScores).length === 0) {
    redirect('/tes');
  }

  // Teruskan objek yang aman ini ke service Anda.
  const report = await getAnalysisReport(riasecScores);
  const { userProfile, majorMatches, careerMatches, motivation } = report;

  return (
    <div className="space-y-10">
      {/* Bagian Header Personal */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
          Analisis Kepribadian <br />
          <span className="text-blue-600">{userProfile.personaName}</span>
        </h1>
        {/* 2. GANTI <p> BIASA DENGAN <ReactMarkdown> */}
        <div className="mt-4 max-w-3xl mx-auto text-lg text-slate-600">
          <ReactMarkdown>{motivation}</ReactMarkdown>
        </div>
      </header>
      
      {/* Bagian Visualisasi Data */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-slate-700 mb-4 text-center">Profil Minatmu</h2>
          <div className="space-y-3">
            {/* --- PERBAIKAN: Beri tipe pada parameter map --- */}
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
          <h2 className="text-xl font-bold text-slate-700 text-center">
            Peta Minatmu
          </h2>
          <HexagonChart 
            percentages={userProfile.percentages} 
            topThree={userProfile.topThree} 
          />
        </div>
      </section>

      {/* Bagian Rekomendasi */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rekomendasi Jurusan */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">Rekomendasi Jurusan</h2>
          {/* --- PERBAIKAN: Beri tipe 'major' --- */}
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
                Profil Jurusan: {Object.entries(major.riasecProfile).map(([t,s]) => `${t}:${s}`).join(', ')}
              </p>
            </div>
          ))}
        </div>
        {/* Rekomendasi Karier */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">Rekomendasi Karier</h2>
          {/* --- PERBAIKAN: Beri tipe 'career' --- */}
          {careerMatches.map((career: MatchResult) => (
            <div key={career.id} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-slate-900">{career.name}</h3>
                <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full whitespace-nowrap">
                  Sesuai Minat {riasecDetails[career.matchedType].name.replace(/\s\(.*\)/, '')}
                </span>
              </div>
              <p className="mt-2 text-slate-600">{career.description}</p>
              {/* ... (Profil Karier tidak berubah) ... */}
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