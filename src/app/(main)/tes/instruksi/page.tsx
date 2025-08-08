// Lokasi: src/app/(main)/tes/instruksi/page.tsx

'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, type ReactNode } from 'react'; // <-- PERBAIKAN DI SINI

// Komponen baru untuk item instruksi
const InstructionItem = ({ icon, children }: { icon: ReactNode, children: ReactNode }) => (
  <div className="flex items-start space-x-4 text-left">
    <div className="flex-shrink-0 text-green-600 mt-1">
      {icon}
    </div>
    <p className="text-slate-700">{children}</p>
  </div>
);

// Komponen Pembungkus untuk menyediakan Suspense
export default function InstructionPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-slate-500">Memuat instruksi...</p>
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
  const paramsString = searchParams.toString();

  const handleStartTest = () => {
    router.push(`/tes?${paramsString}`);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-lg text-center">
        <div className="mx-auto bg-green-100 text-green-600 rounded-full h-16 w-16 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Kamu Sudah Siap!</h1>
        <p className="text-slate-600 mb-8">
          Baca beberapa poin penting di bawah ini sebelum kamu memulai tes.
        </p>
        
        <div className="space-y-6 bg-slate-50 p-6 rounded-lg">
          <InstructionItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>
            Tes ini terdiri dari <strong>90 pertanyaan</strong> dan membutuhkan waktu sekitar <strong>5-10 menit</strong>.
          </InstructionItem>
          <InstructionItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.373 3.373 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}>
            Kerjakan dalam kondisi <strong>tenang dan fokus</strong>. Pastikan kamu sedang dalam kondisi fit untuk hasil yang lebih akurat.
          </InstructionItem>
          <InstructionItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
            <strong>Tidak ada jawaban benar atau salah.</strong> Jawablah dengan jujur sesuai dengan kepribadianmu, bukan apa yang menurutmu ideal.
          </InstructionItem>
          <InstructionItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V8z" /></svg>}>
            Hasil tes ini adalah sebuah <strong>panduan dan titik awal diskusi</strong>, bukan penentu mutlak masa depanmu.
          </InstructionItem>
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