// src/app/(main)/hasil/page.tsx

import { Suspense } from 'react';
import { RiasecType } from '@/data/riasecQuestions';
import { riasecDetails } from '@/data/riasecDescriptions';

// Tipe untuk searchParams yang SUDAH di-resolve
type ResolvedSearchParams = { [key: string]: string | string[] | undefined };

// Tipe untuk props Halaman, searchParams adalah Promise
type HasilPageProps = {
  searchParams: Promise<ResolvedSearchParams>; // <-- PERUBAHAN TIPE
};

// Tipe untuk props HasilContent, searchParams adalah objek biasa
type HasilContentProps = {
  searchParams: ResolvedSearchParams;
}

// Komponen utama halaman menjadi ASYNC
export default async function HasilPage({ searchParams }: HasilPageProps) { // <-- TAMBAHKAN ASYNC
  const resolvedSearchParams = await searchParams; // <-- LAKUKAN AWAIT

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800">Hasil Analisis Minat Bakatmu</h1>
          <p className="mt-2 text-lg text-slate-600">Inilah tiga tipe kepribadian yang paling menonjol dalam dirimu.</p>
        </div>
        
        {/* 
          Suspense tetap penting karena async component bisa memakan waktu.
          Kita sekarang me-pass searchParams yang sudah di-resolve (bukan promise lagi).
        */}
        <Suspense fallback={<LoadingSkeleton />}>
          <HasilContent searchParams={resolvedSearchParams} />
        </Suspense>

      </div>
    </main>
  );
}

// Komponen terpisah untuk memproses dan menampilkan konten
function HasilContent({ searchParams }: HasilContentProps) {
  // 1. Proses data dari URL
  const scores: { type: RiasecType; score: number }[] = Object.entries(searchParams)
    .map(([key, value]) => ({
      type: key as RiasecType,
      score: Number(value),
    }))
    .filter(item => riasecDetails[item.type]) // Filter jika ada param yg bukan RIASEC
    .sort((a, b) => b.score - a.score); // Urutkan dari skor tertinggi

  // Jika tidak ada skor, tampilkan pesan
  if (scores.length < 3) {
    return (
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600">Oops! Data tidak ditemukan.</h2>
        <p className="mt-2">Sepertinya kamu belum menyelesaikan tes. Silakan kembali dan selesaikan tesnya terlebih dahulu.</p>
      </div>
    )
  }

  // 2. Ambil 3 tipe teratas
  const topThree = scores.slice(0, 3).map(s => riasecDetails[s.type]);
  const dominantType = topThree[0];
  const secondaryTypes = topThree.slice(1);

  // 3. Render UI
  return (
    <div className="space-y-8">
      {/* Tipe Dominan */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-600">
        <h2 className="text-sm font-bold uppercase text-blue-600">Tipe Dominan Kamu</h2>
        <h3 className="mt-1 text-3xl font-bold text-slate-900">{dominantType.name} ({dominantType.code})</h3>
        <p className="mt-4 text-slate-700">{dominantType.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {dominantType.keywords.map(keyword => (
            <span key={keyword} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{keyword}</span>
          ))}
        </div>
      </div>

      {/* 2 Tipe Pendukung */}
      <div className="grid md:grid-cols-2 gap-8">
        {secondaryTypes.map((type, index) => (
          <div key={type.code} className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-slate-400">
            <h2 className="text-sm font-bold uppercase text-slate-500">Tipe Pendukung #{index + 1}</h2>
            <h3 className="mt-1 text-2xl font-bold text-slate-800">{type.name} ({type.code})</h3>
            <p className="mt-3 text-slate-600 text-sm">{type.description}</p>
          </div>
        ))}
      </div>

      {/* Rekomendasi Karier & Jurusan */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Rekomendasi Jalur Untukmu</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-lg text-slate-700 mb-2">🎓 Contoh Jurusan Kuliah</h3>
            <ul className="space-y-1 list-disc list-inside text-slate-600">
              {/* Gabungkan jurusan dari 3 tipe teratas dan ambil beberapa contoh unik */}
              {[...new Set([...dominantType.majors, ...secondaryTypes.flatMap(t => t.majors)])].slice(0, 6).map(major => (
                <li key={major}>{major}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-700 mb-2">💼 Contoh Profesi</h3>
            <ul className="space-y-1 list-disc list-inside text-slate-600">
              {[...new Set([...dominantType.careers, ...secondaryTypes.flatMap(t => t.careers)])].slice(0, 6).map(career => (
                <li key={career}>{career}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen untuk UI loading (jika diperlukan)
function LoadingSkeleton() {
  return <div className="text-center p-8">Memuat hasil...</div>;
}