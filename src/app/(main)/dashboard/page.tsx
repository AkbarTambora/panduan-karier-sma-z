// src/app/(main)/dashboard/page.tsx
import Link from 'next/link';
import Image from 'next/image'; // <-- 1. Import komponen Image

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-4">
      <div className="max-w-2xl">
        {/* ... (kode judul dan paragraf tetap sama) ... */}
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800">
          Temukan <span className="text-blue-600">Jalur Karier</span> Impianmu
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Bingung setelah lulus SMA mau ke mana? Tenang, kamu tidak sendiri. Aplikasi ini dirancang khusus untuk membantumu mengenali minat dan bakat terpendam, serta melihat pilihan karier yang paling cocok untukmu.
        </p>
        <p className="mt-2 text-sm text-slate-500 italic">
          `Satu-satunya cara untuk melakukan pekerjaan hebat adalah dengan mencintai apa yang kamu lakukan.` - Steve Jobs
        </p>
        <div className="mt-8">
          <Link 
            href="/tes" 
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Mulai Tes Minat Bakat (5 Menit)
          </Link>
        </div>
      </div>
      
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Kenapa Ini Penting?</h2>
        
        {/* 2. Tambahkan komponen Image di sini */}
        <div className="w-full aspect-video max-w-2xl mx-auto relative mb-4 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/images/career-guidance-dashboard.png" // Path relatif dari folder 'public'
            alt="Ilustrasi siswa di persimpangan jalan karier"
            fill // <-- Prop 'fill' menggantikan layout="fill"
            className="object-cover" // <-- Kelas Tailwind menggantikan objectFit="cover"
          />
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
            <p className="text-left text-slate-700">
            Menurut data, <strong>87% mahasiswa Indonesia merasa salah jurusan.</strong> Ini bukan cuma soal buang-buang waktu dan uang, tapi juga tentang kebahagiaanmu di masa depan. Memilih jurusan yang sesuai dengan <span className="font-bold text-blue-600">kepribadian</span> dan <span className="font-bold text-green-600">minatmu</span> adalah langkah pertama menuju karier yang memuaskan dan sukses. Jangan biarkan masa depanmu ditentukan oleh kebetulan.
            </p>
        </div>
      </div>
    </div>
  );
}