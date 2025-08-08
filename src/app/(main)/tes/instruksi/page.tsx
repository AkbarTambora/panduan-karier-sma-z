// Lokasi: src/app/(main)/tes/instruksi/page.tsx

'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react'; // <-- Impor Suspense dari 'react'
import ReactMarkdown from 'react-markdown';

// Komponen Pembungkus untuk menyediakan Suspense
export default function InstructionPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        }>
            <Instructions />
        </Suspense>
    );
}

// Komponen inti yang menggunakan useSearchParams
function Instructions() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ambil dan teruskan parameter dari halaman sebelumnya
  // searchParams.toString() akan menghasilkan "nama=Budi&kelas=XI..."
  const paramsString = searchParams.toString();

  const handleStartTest = () => {
    // Teruskan string parameter yang sama persis ke halaman tes
    router.push(`/tes?${paramsString}`);
  };

  const instructionText = `
*   Tes ini terdiri dari **90 pertanyaan** dan membutuhkan waktu sekitar **5-10 menit**.
*   Kerjakan dalam kondisi **tenang, fokus, dan tidak terburu-buru** untuk hasil yang lebih akurat. Pastikan kamu sedang dalam kondisi fit.
*   **Tidak ada jawaban benar atau salah.** Jawablah dengan jujur sesuai dengan kepribadianmu, bukan apa yang menurutmu ideal.
*   Hasil tes ini adalah sebuah **panduan dan titik awal diskusi**, bukan penentu mutlak masa depanmu.
  `;

  return (
    <main className="flex flex-col items-center min-h-screen bg-slate-50 p-4 pt-12">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-4">Langkah 2: Instruksi Pengerjaan</h1>
        
        {/* Styling otomatis dari @tailwindcss/typography */}
        <div className="prose prose-slate max-w-none text-left">
          <ReactMarkdown>{instructionText}</ReactMarkdown>
        </div>
        
        <button 
          onClick={handleStartTest}
          className="mt-8 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105"
        >
          Saya Mengerti & Mulai Tes
        </button>
      </div>
    </main>
  );
}