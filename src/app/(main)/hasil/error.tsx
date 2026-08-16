// src/app/(main)/hasil/error.tsx
// Error boundary untuk halaman hasil jika getAnalysisReport() gagal

'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function HasilError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error di halaman hasil:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Terjadi Kesalahan</h2>
        <p className="text-slate-500 text-sm mb-6">
          Gagal memuat hasil analisis. Ini bisa terjadi jika ada masalah koneksi ke database.
          Coba lagi atau kembali ke halaman tes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
          <Link
            href="/tes/mulai"
            className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Ulangi Tes
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-slate-300 mt-4">Error ID: {error.digest}</p>
        )}
      </div>
    </main>
  );
}
