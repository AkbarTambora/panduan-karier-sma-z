// Lokasi: src/app/(main)/dashboard/page.tsx

import Link from 'next/link';
import Image from 'next/image';

// Komponen Ikon sederhana untuk digunakan kembali
const InfoCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
    <div className="bg-blue-100 text-blue-600 rounded-full p-3 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm">{children}</p>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-4 py-20 sm:py-32 bg-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            Temukan <span className="text-blue-600">Jalur Karier</span> Impianmu
          </h1>

          <div className="mt-16 w-full max-w-4xl mx-auto">
            <div className="w-full aspect-video relative rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/career-guidance-dashboard.png"
                alt="Ilustrasi siswa di persimpangan jalan karier"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <br></br>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Bingung setelah lulus SMA mau ke mana? Aplikasi ini dirancang untuk membantumu mengenali minat & bakat terpendam, serta melihat pilihan karier yang paling cocok untukmu.
          </p>
          <div className="mt-8">
            <Link
              href="/tes/mulai" // Arahkan ke halaman form baru
              className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Mulai Tes Gratis (5-10 Menit)
            </Link>
          </div>
        </div>
      </main>

      {/* 2. "Kenapa Ini Penting" Section */}
      <section className="px-4 py-16 sm:py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">Kenapa Tes Ini Penting Untukmu?</h2>
            <p className="mt-3 text-slate-600">Memilih jurusan bukan soal untung-untungan. Ini tentang masa depanmu.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InfoCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title="Hindari Salah Jurusan"
            >
              Menurut data Kemendikbud, <strong className="text-red-600">87% mahasiswa Indonesia</strong> merasa salah jurusan. Jangan sampai kamu jadi salah satunya.
            </InfoCard>
            <InfoCard 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              title="Kenali Diri Lebih Dalam"
            >
              Temukan 3 tipe kepribadian dominanmu berdasarkan teori RIASEC yang diakui secara internasional oleh para psikolog.
            </InfoCard>
            <InfoCard
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title="Dapatkan Rekomendasi Personal"
            >
              Lihat daftar jurusan kuliah dan karier yang paling cocok dengan profil unikmu, lengkap dengan tingkat kecocokannya.
            </InfoCard>
          </div>
          
        </div>
      </section>

      {/* 3. Footer Sederhana */}
      <footer className="text-center py-8 bg-white border-t">
        <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Panduan Karier SMA Z. Dikembangkan untuk tujuan pendidikan.</p>
      </footer>
    </div>
  );
}