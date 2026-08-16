// src/app/(main)/hasil/page.tsx

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getAnalysisReport } from '@/lib/services/riasecService';
import { riasecDetails } from '@/data/riasecDescriptions';
import { HexagonChart } from '@/components/results/HexagonChart';
import { GroupedRecommendations } from '@/components/results/GroupedRecommendation';
import { FeedbackWidget } from '@/components/results/FeedbackWidget';
import { SaveResultButton } from './SaveResultButton';
import type { RiasecType } from '@/data/riasecQuestions';
import ReactMarkdown from 'react-markdown';
import { BookOpen, Briefcase, SparklesIcon } from 'lucide-react';

const riasecColors = {
  R: { bg: 'bg-orange-500', text: 'text-orange-800', bgLight: 'bg-orange-100' },
  I: { bg: 'bg-blue-500', text: 'text-blue-800', bgLight: 'bg-blue-100' },
  A: { bg: 'bg-purple-500', text: 'text-purple-800', bgLight: 'bg-purple-100' },
  S: { bg: 'bg-green-500', text: 'text-green-800', bgLight: 'bg-green-100' },
  E: { bg: 'bg-red-500', text: 'text-red-800', bgLight: 'bg-red-100' },
  C: { bg: 'bg-slate-500', text: 'text-slate-800', bgLight: 'bg-slate-100' },
};

type HasilPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HasilPage({ searchParams }: HasilPageProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12">
        <Suspense fallback={<LoadingSkeleton />}>
          <HasilContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function HasilContent({ searchParams }: HasilPageProps) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();

  const RIASEC_TYPES: RiasecType[] = ['R', 'I', 'A', 'S', 'E', 'C'];

  const namaValue = resolvedSearchParams.nama;
  const nama = Array.isArray(namaValue) ? namaValue[0] : namaValue || session?.user?.name || 'Siswa';

  const kelasValue = resolvedSearchParams.kelas;
  const kelas = Array.isArray(kelasValue) ? kelasValue[0] : kelasValue || session?.user?.class || 'Kelas';

  const sekolahValue = resolvedSearchParams.sekolah;
  const sekolah = Array.isArray(sekolahValue) ? sekolahValue[0] : sekolahValue || session?.user?.school || 'Sekolah';

  const testModeValue = resolvedSearchParams.testMode;
  const testMode = (Array.isArray(testModeValue) ? testModeValue[0] : testModeValue) as 'quick' | 'full' | undefined;

  const riasecScores: { [key: string]: string } = {};
  for (const key of RIASEC_TYPES) {
    const scoreValue = resolvedSearchParams[key];
    if (scoreValue && typeof scoreValue === 'string') {
      riasecScores[key] = scoreValue;
    }
  }

  if (Object.keys(riasecScores).length === 0) {
    redirect('/tes/mulai');
  }

  const report = await getAnalysisReport(riasecScores);
  const { userProfile, majorMatches, careerMatches, motivation } = report;

  const topRecommendations = {
    majors: Object.values(majorMatches.topPicks).flat().map(item => item.name),
    careers: Object.values(careerMatches.topPicks).flat().map(item => item.name),
  };

  // Data untuk SaveResultButton
  const saveData = {
    testMode: testMode || 'full',
    scores: Object.fromEntries(
      RIASEC_TYPES.map(type => [type, Number(riasecScores[type] || 0)])
    ) as Record<RiasecType, number>,
    userProfile,
    nama,
    kelas,
    sekolah,
  };

  return (
    <div className="space-y-12">
      {/* Header Personal */}
      <header className="text-center border-b-2 border-slate-200 pb-8">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <SparklesIcon className="h-4 w-4" />
          <span>Analisis Selesai</span>
        </div>
        <p className="text-2xl font-bold text-slate-800 mb-1">{nama}</p>
        <p className="text-lg text-slate-600">{kelas} · {sekolah}</p>
        {testMode && (
          <div className="mt-3">
            <span className={`inline-flex items-center space-x-1.5 text-xs px-3 py-1 rounded-full font-medium ${
              testMode === 'quick' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <span>{testMode === 'quick' ? '⚡ Quick Test (18 soal)' : '📊 Tes Lengkap (90 soal)'}</span>
            </span>
          </div>
        )}

        {/* Save & Share — tampilkan komponen client untuk aksi save */}
        <div className="mt-4">
          <SaveResultButton
            saveData={saveData}
            isLoggedIn={!!session?.user?.id}
          />
        </div>
      </header>

      {/* Analisis Kepribadian */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Analisis Kepribadian <br />
          <span className="text-blue-600">{userProfile.personaName}</span>
        </h1>
        <div className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <ReactMarkdown>{motivation}</ReactMarkdown>
        </div>
      </section>

      {/* Visualisasi Data */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-slate-700 mb-4 text-center">Profil Minatmu</h2>
          <div className="space-y-3">
            {userProfile.percentages.map(([type, percentage]: [RiasecType, number]) => (
              <div key={type}>
                <div className="flex justify-between mb-1">
                  <span className="text-base font-medium text-slate-700">
                    {riasecDetails[type].name.replace(/\s\(.*\)/, '')}
                  </span>
                  <span className={`text-sm font-medium ${riasecColors[type].text}`}>
                    {percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
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

      {/* Rekomendasi */}
      <section className="space-y-12">
        <GroupedRecommendations
          title="Rekomendasi Jurusan Kuliah"
          curatedItems={majorMatches}
          icon={<BookOpen className="h-6 w-6" />}
          riasecColors={riasecColors}
        />
        <GroupedRecommendations
          title="Rekomendasi Kelompok Karier"
          curatedItems={careerMatches}
          icon={<Briefcase className="h-6 w-6" />}
          riasecColors={riasecColors}
        />
      </section>

      {/* Feedback */}
      <section className="space-y-6">
        <FeedbackWidget
          userProfile={{
            personaName: userProfile.personaName,
            topThree: userProfile.topThree,
          }}
          topRecommendations={topRecommendations}
        />
      </section>

      {/* Langkah Selanjutnya */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-blue-100 p-8 rounded-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-500 p-2 rounded-lg">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">🚀 Langkah Selanjutnya</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: 1, title: 'Diskusi dengan Orangtua', desc: 'Bagikan hasil ini dengan orangtua dan diskusikan pilihan yang paling realistis.' },
            { num: 2, title: 'Riset Lebih Dalam', desc: 'Cari tahu lebih detail tentang jurusan dan karier yang menarik bagimu.' },
            { num: 3, title: 'Konsultasi Guru BK', desc: 'Tunjukkan hasil ini ke guru bimbingan konseling untuk panduan lebih lanjut.' },
          ].map(({ num, title, desc }) => (
            <div key={num} className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-blue-500 text-white text-sm font-bold px-2 py-1 rounded">{num}</span>
                <h4 className="font-bold text-slate-800">{title}</h4>
              </div>
              <p className="text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="text-center border-b-2 border-slate-200 pb-8">
        <div className="h-4 bg-slate-200 rounded w-32 mx-auto mb-4 animate-pulse"></div>
        <div className="h-8 bg-slate-200 rounded w-48 mx-auto mb-2 animate-pulse"></div>
        <div className="h-6 bg-slate-200 rounded w-64 mx-auto animate-pulse"></div>
      </div>
      <div className="text-center">
        <div className="h-12 bg-slate-200 rounded w-96 mx-auto mb-6 animate-pulse"></div>
        <div className="h-24 bg-slate-200 rounded w-full max-w-3xl mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="h-6 bg-slate-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-4 bg-slate-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="h-6 bg-slate-200 rounded w-48 mb-4 mx-auto animate-pulse"></div>
          <div className="h-64 bg-slate-200 rounded mx-auto animate-pulse"></div>
        </div>
      </div>
      <div className="text-center p-12 text-lg font-semibold text-slate-600">
        Menganalisis jawabanmu dan menyiapkan rekomendasi terbaik...
      </div>
    </div>
  );
}