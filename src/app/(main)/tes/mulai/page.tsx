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
    <main className="flex flex-col items-center min-h-screen bg-slate-50 p-4 pt-12">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">Langkah 1: Isi Data Diri</h1>
        <p className="text-slate-600 text-center mb-6">Hasil tes akan dipersonalisasi dengan data ini.</p>
        
        {/* FORM YANG LENGKAP */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Contoh: Budi Santoso"
            />
          </div>
          <div>
            <label htmlFor="kelas" className="block text-sm font-medium text-slate-700">Kelas</label>
            <input
              id="kelas"
              type="text"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Contoh: XI MIPA 1"
            />
          </div>
          <div>
            <label htmlFor="sekolah" className="block text-sm font-medium text-slate-700">Asal Sekolah</label>
            <input
              id="sekolah"
              type="text"
              value={sekolah}
              onChange={(e) => setSekolah(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Contoh: SMAN 1 Jakarta"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Simpan & Lanjut ke Instruksi
          </button>
        </form>
      </div>
    </main>
  );
}