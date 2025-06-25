// src/app/(main)/tes/page.tsx
import TestEngine from '@/components/TestEngine'; 

export default function TesPage() {
  return (
    // Ganti background menjadi abu-abu muda
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-slate-50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Tes Minat Bakat RIASEC</h1>
        <p className="text-slate-600 mt-2">Pilih jawaban yang paling sesuai dengan dirimu.</p>
      </div>
      <TestEngine />
    </main>
  );
}