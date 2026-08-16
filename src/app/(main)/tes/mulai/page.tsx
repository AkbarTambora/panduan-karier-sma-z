// src/app/(main)/tes/mulai/page.tsx
// Halaman terpadu untuk memulai tes (otomatis mendeteksi sesi login atau form tamu)

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function StartTestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('');
  const [sekolah, setSekolah] = useState('');
  const [isManualOverride, setIsManualOverride] = useState(false);

  // Auto-fill dari akun jika sudah login
  useEffect(() => {
    if (session?.user && !isManualOverride) {
      setNama(session.user.name || '');
      setKelas(session.user.class || '');
      setSekolah(session.user.school || '');
    }
  }, [session, isManualOverride]);

  const handleStartWithSession = () => {
    const finalNama = session?.user?.name || nama || 'Siswa';
    const finalKelas = session?.user?.class || kelas || 'Kelas';
    const finalSekolah = session?.user?.school || sekolah || 'Sekolah';

    const params = new URLSearchParams({
      nama: finalNama.trim(),
      kelas: finalKelas.trim(),
      sekolah: finalSekolah.trim(),
    });
    router.push(`/tes/instruksi?${params.toString()}`);
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !kelas.trim() || !sekolah.trim()) {
      alert('Harap lengkapi semua data diri sebelum memulai.');
      return;
    }
    const params = new URLSearchParams({
      nama: nama.trim(),
      kelas: kelas.trim(),
      sekolah: sekolah.trim(),
    });
    router.push(`/tes/instruksi?${params.toString()}`);
  };

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="md:flex">
            {/* Sisi Kiri: Ilustrasi & Informasi */}
            <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 sm:p-12 text-white flex flex-col justify-between">
              <div>
                <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight">Tes Minat &amp; Bakat RIASEC</h2>
                <p className="mt-4 text-blue-100 text-sm leading-relaxed">
                  Temukan kombinasi 3 tipe kepribadian dominanmu dan eksplorasi jurusan kuliah serta karier yang paling sesuai dengan potensimu.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20 text-xs text-blue-100 space-y-2">
                <div className="flex items-center space-x-2">
                  <span>⚡</span>
                  <span><strong>Quick Test:</strong> 2-3 Menit (18 Pertanyaan)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📊</span>
                  <span><strong>Tes Lengkap:</strong> 5-8 Menit (90 Pertanyaan)</span>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: State Login vs State Tamu */}
            <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
              {status === 'loading' ? (
                <div className="py-16 text-center">
                  <div className="animate-spin h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Memeriksa status akun...</p>
                </div>
              ) : session?.user && !isManualOverride ? (
                /* ======================================================== */
                /* STATE 1: SUDAH LOGIN (Auto-detect & Quick Start)          */
                /* ======================================================== */
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Akun Terverifikasi</span>
                  </div>

                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">Siap Mulai Tes?</h1>
                    <p className="text-slate-500 text-sm mt-1">
                      Data dirimu otomatis terhubung dengan akun Panduan Karier.
                    </p>
                  </div>

                  {/* Profil Ringkas dari Akun */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 truncate">{session.user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 block">Asal Sekolah:</span>
                        <span className="font-semibold text-slate-700">{session.user.school || 'Belum diatur'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Kelas:</span>
                        <span className="font-semibold text-slate-700">{session.user.class || 'Belum diatur'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="space-y-3">
                    <button
                      onClick={handleStartWithSession}
                      className="w-full bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-200 flex items-center justify-center space-x-2"
                    >
                      <span>Lanjut ke Pilihan Mode Tes</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsManualOverride(true)}
                      className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors"
                    >
                      Ubah data sementara untuk tes ini ✎
                    </button>
                  </div>
                </div>
              ) : (
                /* ======================================================== */
                /* STATE 2: BELUM LOGIN / MODE MANUAL GUEST                 */
                /* ======================================================== */
                <div className="space-y-5">
                  {!session && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-blue-800">
                      <span className="text-base">💡</span>
                      <div>
                        <p className="font-semibold">Sudah punya akun?</p>
                        <p className="text-blue-600 mt-0.5">
                          <Link href="/login?callbackUrl=/tes/mulai" className="font-bold underline hover:text-blue-800">
                            Masuk sekarang
                          </Link>{' '}
                          agar tidak perlu isi data diri lagi &amp; hasil tes langsung tersimpan di profilmu.
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                      {isManualOverride ? 'Sesuaikan Data Tes' : 'Isi Data Diri Tamu'}
                    </h1>
                    <p className="text-slate-500 text-xs mt-1">
                      Data ini dicantumkan pada kartu hasil analisis minat bakatmu.
                    </p>
                  </div>

                  <form onSubmit={handleGuestSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="nama" className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="nama"
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                        required
                        placeholder="Contoh: Budi Santoso"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="kelas" className="block text-xs font-semibold text-slate-700 mb-1">
                          Kelas <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="kelas"
                          type="text"
                          value={kelas}
                          onChange={(e) => setKelas(e.target.value)}
                          className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                          required
                          placeholder="XI MIPA 1"
                        />
                      </div>
                      <div>
                        <label htmlFor="sekolah" className="block text-xs font-semibold text-slate-700 mb-1">
                          Asal Sekolah <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="sekolah"
                          type="text"
                          value={sekolah}
                          onChange={(e) => setSekolah(e.target.value)}
                          className="w-full px-3.5 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                          required
                          placeholder="SMAN 1 Jakarta"
                        />
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-[1.02] shadow-md shadow-blue-200"
                      >
                        Lanjut ke Pilihan Mode Tes →
                      </button>

                      {isManualOverride && session && (
                        <button
                          type="button"
                          onClick={() => setIsManualOverride(false)}
                          className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 font-medium"
                        >
                          Batalkan &amp; gunakan data akun
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}