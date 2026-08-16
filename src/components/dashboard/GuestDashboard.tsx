// src/components/dashboard/GuestDashboard.tsx
// Landing page untuk pengunjung tamu — Menampilkan 2 pilihan jelas: Tes Tamu Instan vs Akun Member

import Link from 'next/link';

export function GuestDashboard() {
  const samplePersonas = [
    { name: 'Si Kreatif yang Realistis', top: ['A', 'R', 'I'], school: 'SMAN 1 Bandung', time: 'Baru saja', emoji: '🎨', color: 'border-purple-200 bg-purple-50 text-purple-700' },
    { name: 'Si Penolong yang Pengusaha', top: ['S', 'E', 'A'], school: 'SMAN 8 Jakarta', time: '10 mnt lalu', emoji: '🤝', color: 'border-green-200 bg-green-50 text-green-700' },
    { name: 'Si Pemikir yang Teratur', top: ['I', 'C', 'R'], school: 'SMAN 3 Yogyakarta', time: '25 mnt lalu', emoji: '🔬', color: 'border-blue-200 bg-blue-50 text-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6">
            <span>✨ Tes Minat Bakat RIASEC untuk Siswa SMA</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl leading-tight">
            Temukan <span className="text-blue-600">Jalur Karier &amp; Jurusan Kuliah</span> Impianmu
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Bingung pilih jurusan kuliah setelah lulus SMA? Kenali kombinasi kepribadian Holland Code (RIASEC) milikmu dan dapatkan kurasi jurusan serta karier yang paling sesuai.
          </p>

          {/* DUA PILIHAN UTAMA: PILIH SESUAI KEBUTUHAN */}
          <div className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* OPSI 1: TES INSTAN (TAMU) */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 p-6 sm:p-8 rounded-3xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                ⚡ Instan &amp; Cepat
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl mb-4 shadow-md shadow-blue-200">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Mulai Tes Langsung (Tamu)</h3>
                <p className="text-xs text-slate-500 mb-4">Cocok jika kamu ingin coba cepat tanpa perlu registrasi dulu.</p>

                <ul className="space-y-2 text-xs text-slate-600 mb-6">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span><strong>Tanpa login</strong>, langsung isi kuesioner</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Hasil analisis dan kurasi jurusan langsung keluar</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Bisa langsung <strong>bagikan hasil ke WhatsApp</strong></span>
                  </li>
                </ul>
              </div>

              <Link
                href="/tes/mulai"
                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 text-center text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Mulai Tes Tanpa Akun →</span>
              </Link>
            </div>

            {/* OPSI 2: DAFTAR / MASUK MEMBER */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-4 right-4 bg-purple-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                👑 Fitur Penuh
              </div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center text-2xl mb-4 backdrop-blur-sm border border-white/20">
                  🚀
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Daftar / Masuk Akun Member</h3>
                <p className="text-xs text-blue-200 mb-4">Akses semua fitur eksklusif, simpan progres, dan jelajahi komunitas.</p>

                <ul className="space-y-2 text-xs text-blue-100 mb-6">
                  <li className="flex items-center space-x-2">
                    <span className="text-purple-300 font-bold">✓</span>
                    <span><strong>Auto-fill data:</strong> Tidak perlu isi nama/sekolah berulang kali</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-purple-300 font-bold">✓</span>
                    <span><strong>Simpan riwayat:</strong> Pantau perkembangan minatmu</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-purple-300 font-bold">✓</span>
                    <span><strong>Akses penuh Explore:</strong> Lihat hasil &amp; tren teman sebaya</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/login"
                  className="py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl text-center text-xs transition-colors"
                >
                  Masuk (Login)
                </Link>
                <Link
                  href="/register"
                  className="py-3 bg-white text-slate-900 hover:bg-blue-50 font-bold rounded-xl text-center text-xs shadow-md transition-colors"
                >
                  Daftar Gratis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Fitur Spill: Explore Komunitas */}
      <section className="px-4 sm:px-6 py-16 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
                <span>🔒 Fitur Khusus Member</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Jelajahi Hasil &amp; Tren Teman Sebaya di Explore
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Di halaman <strong>Explore</strong>, member bisa melihat distribusi kepribadian siswa lain, jurusan yang sedang diminati, serta memfilter rekomendasi berdasarkan tipe RIASEC.
              </p>
              <div className="pt-2">
                <Link
                  href="/login?callbackUrl=/explore"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all text-xs shadow-md"
                >
                  <span>Buka Akses Explore →</span>
                </Link>
              </div>
            </div>

            {/* Preview Feed Siswa */}
            <div className="lg:col-span-6 space-y-3">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Preview Siswa yang Sudah Tes:</p>
              {samplePersonas.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg shrink-0">
                      {item.emoji}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">{item.name}</h4>
                      <p className="text-[11px] text-slate-400">{item.school} • {item.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {item.top.map((t) => (
                      <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-slate-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Kenapa RIASEC */}
      <section className="px-4 sm:px-6 py-16 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3">6 Tipe Kepribadian Holland Code (RIASEC)</h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mb-10">
            Setiap orang memiliki perpaduan unik dari 6 dimensi ini yang menentukan jurusan dan lingkungan kerja paling ideal baginya:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { code: 'R', title: 'Realistic', label: 'Praktis & Mesin', emoji: '🔧', color: 'bg-orange-50 text-orange-700 border-orange-200' },
              { code: 'I', title: 'Investigative', label: 'Analitis & Riset', emoji: '🔬', color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { code: 'A', title: 'Artistic', label: 'Kreatif & Desain', emoji: '🎨', color: 'bg-purple-50 text-purple-700 border-purple-200' },
              { code: 'S', title: 'Social', label: 'Edukasi & Peduli', emoji: '🤝', color: 'bg-green-50 text-green-700 border-green-200' },
              { code: 'E', title: 'Enterprising', label: 'Bisnis & Pimpin', emoji: '🚀', color: 'bg-red-50 text-red-700 border-red-200' },
              { code: 'C', title: 'Conventional', label: 'Detail & Data', emoji: '📋', color: 'bg-slate-50 text-slate-700 border-slate-200' },
            ].map((t) => (
              <div key={t.code} className={`p-4 rounded-2xl border ${t.color} text-center space-y-1.5`}>
                <span className="text-2xl block">{t.emoji}</span>
                <span className="font-extrabold text-sm block">{t.title}</span>
                <span className="text-[11px] opacity-80 block">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="text-center py-8 bg-slate-50 border-t border-slate-200">
        <p className="text-slate-500 text-xs">
          &copy; {new Date().getFullYear()} Panduan Karier SMA Z. Dikembangkan untuk panduan minat bakat siswa SMA.
        </p>
      </footer>
    </div>
  );
}
