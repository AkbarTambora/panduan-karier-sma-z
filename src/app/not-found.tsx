// src/app/not-found.tsx
// Halaman 404 custom

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="text-8xl font-black text-slate-100 select-none mb-4">404</div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 -mt-8 relative">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Halaman Tidak Ditemukan</h1>
          <p className="text-slate-500 mb-6 text-sm">
            Halaman yang kamu cari tidak ada atau mungkin sudah dipindahkan.
            Yuk kembali ke beranda atau mulai tes!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              Ke Beranda
            </Link>
            <Link
              href="/tes/mulai"
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Mulai Tes
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
