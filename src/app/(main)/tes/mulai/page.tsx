// Lokasi: src/app/(main)/tes/mulai/page.tsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StartTestPage() {
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('');
  const [sekolah, setSekolah] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !kelas.trim() || !sekolah.trim()) {
      alert('Harap isi semua data diri dengan lengkap.');
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
    <main className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Bagian Kiri: Ilustrasi & Motivasi */}
            <div className="md:w-1/2 bg-blue-50 p-8 sm:p-12 flex flex-col justify-center">
              <div className="text-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Satu Langkah Lagi...</h2>
              <p className="mt-2 text-slate-600">
                Data dirimu akan digunakan untuk membuat halaman hasil yang terasa lebih personal dan hanya untukmu.
              </p>
            </div>

            {/* Bagian Kanan: Form */}
            <div className="md:w-1/2 p-8 sm:p-12">
              <h1 className="text-2xl font-bold text-slate-800 mb-6">Lengkapi Data Diri</h1>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
                  <input
                    id="nama" type="text" value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required placeholder="Contoh: Budi Santoso"
                  />
                </div>
                <div>
                  <label htmlFor="kelas" className="block text-sm font-medium text-slate-700">Kelas</label>
                  <input
                    id="kelas" type="text" value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required placeholder="Contoh: XI MIPA 1"
                  />
                </div>
                <div>
                  <label htmlFor="sekolah" className="block text-sm font-medium text-slate-700">Asal Sekolah</label>
                  <input
                    id="sekolah" type="text" value={sekolah}
                    onChange={(e) => setSekolah(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required placeholder="Contoh: SMAN 1 Jakarta"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                  Simpan & Lanjut
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}