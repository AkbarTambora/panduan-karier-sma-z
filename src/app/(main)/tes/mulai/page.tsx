// Lokasi file: src/app/(main)/tes/mulai/page.tsx

'use client'; // <-- Ini penting untuk menggunakan hook

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StartTestPage() {
  // State untuk menyimpan input dari pengguna
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('');
  const [sekolah, setSekolah] = useState('');
  const router = useRouter();

  // Fungsi yang dijalankan saat tombol form di-klik
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah halaman refresh
    
    // Validasi sederhana, pastikan semua field diisi
    if (!nama.trim() || !kelas.trim() || !sekolah.trim()) {
      alert('Harap isi semua data diri dengan lengkap.');
      return; // Hentikan fungsi jika ada yang kosong
    }

    // Buat parameter URL dari data form
    const params = new URLSearchParams({
      nama: nama.trim(),
      kelas: kelas.trim(),
      sekolah: sekolah.trim(),
    });

    // Arahkan pengguna ke halaman tes dengan membawa data
    router.push(`/tes?${params.toString()}`);
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-slate-50 p-4 pt-8 sm:pt-12">
      <div className="w-full max-w-lg">
        {/* KARTU FORM IDENTITAS */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-2">Sebelum Memulai Tes</h1>
          <p className="text-slate-600 text-center mb-6">Harap isi data dirimu untuk personalisasi hasil tes.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
              <input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Contoh: Budi Santoso"
                required
              />
            </div>
            
            <div>
              <label htmlFor="kelas" className="block text-sm font-medium text-slate-700">Kelas</label>
              <input
                id="kelas"
                type="text"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Contoh: XI MIPA 1"
                required
              />
            </div>

            <div>
              <label htmlFor="sekolah" className="block text-sm font-medium text-slate-700">Asal Sekolah</label>
              <input
                id="sekolah"
                type="text"
                value={sekolah}
                onChange={(e) => setSekolah(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Contoh: SMAN 1 Jakarta"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Lanjut ke Instruksi
            </button>
          </form>
        </div>

        {/* KARTU INSTRUKSI */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 text-center mb-4">Instruksi Pengerjaan</h2>
          <ul className="list-disc list-inside space-y-2 text-slate-700">
            <li>Tes ini terdiri dari **90 pertanyaan** dan membutuhkan waktu sekitar **5-10 menit**.</li>
            <li>Kerjakan dalam kondisi yang **tenang dan fokus** untuk hasil yang lebih akurat.</li>
            <li>**Tidak ada jawaban benar atau salah.** Jawablah dengan jujur sesuai dengan dirimu.</li>
            <li>Hasil tes ini adalah **panduan**, bukan penentu mutlak masa depanmu. Gunakan sebagai titik awal diskusi dengan guru BK atau orang tua.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}