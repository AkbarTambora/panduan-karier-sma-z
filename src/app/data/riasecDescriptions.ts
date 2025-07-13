// src/data/riasecDescriptions.ts
import { RiasecType } from './riasecQuestions';

export interface RiasecDetail {
  code: RiasecType;
  name: string;
  description: string;
  keywords: string[];
  careers: string[];
  majors: string[];
}

export const riasecDetails: { [key in RiasecType]: RiasecDetail } = {
  R: {
    code: 'R',
    name: 'Realistic (Si Realistis)',
    description: 'Kamu adalah seorang "Macher" – orang yang suka bekerja dengan tangan, peralatan, dan mesin. Kamu menikmati hal-hal yang nyata, praktis, dan menghasilkan sesuatu yang bisa dilihat dan disentuh. Kamu kuat, praktis, dan tidak suka basa-basi.',
    keywords: ['Praktis', 'Mekanis', 'Atletis', 'Alam', 'Konkret'],
    careers: ['Insinyur Mesin', 'Pilot', 'Chef Profesional', 'Ahli Listrik', 'Petugas Pemadam Kebakaran', 'Atlet'],
    majors: ['Teknik Mesin', 'Teknik Sipil', 'Penerbangan', 'Ilmu Keolahragaan', 'Manajemen Konstruksi', 'Agribisnis'],
  },
  I: {
    code: 'I',
    name: 'Investigative (Si Pemikir)',
    description: 'Kamu adalah seorang "Denker" – pemikir yang suka mengamati, belajar, dan memecahkan masalah. Kamu tertarik pada ide, teori, dan bagaimana dunia bekerja. Kamu analitis, penasaran, dan presisi.',
    keywords: ['Analitis', 'Intelektual', 'Sains', 'Penelitian', 'Logis'],
    careers: ['Ilmuwan Data', 'Dokter', 'Programmer', 'Peneliti', 'Analis Keuangan', 'Psikolog'],
    majors: ['Ilmu Komputer', 'Kedokteran', 'Biologi', 'Fisika', 'Matematika', 'Ekonomi'],
  },
  A: {
    code: 'A',
    name: 'Artistic (Si Kreatif)',
    description: 'Kamu adalah seorang "Schöpfer" – pencipta yang punya dunia imajinasi yang kaya. Kamu ekspresif, orisinal, dan suka bekerja dalam situasi yang tidak terstruktur di mana kamu bisa menggunakan kreativitasmu. Kamu intuitif dan independen.',
    keywords: ['Ekspresif', 'Kreatif', 'Imajinatif', 'Seni', 'Inovatif'],
    careers: ['Desainer Grafis', 'Penulis', 'Musisi', 'Arsitek', 'Aktor/Aktris', 'Sutradara Film'],
    majors: ['Desain Komunikasi Visual (DKV)', 'Sastra', 'Seni Musik', 'Arsitektur', 'Jurnalistik', 'Film dan Televisi'],
  },
  S: {
    code: 'S',
    name: 'Social (Si Penolong)',
    description: 'Kamu adalah seorang "Helfer" – penolong yang suka bekerja dengan orang lain untuk mencerahkan, membantu, dan melatih. Kamu menikmati interaksi sosial dan peduli pada kesejahteraan orang lain. Kamu ramah, empatik, dan kooperatif.',
    keywords: ['Empati', 'Sosial', 'Kooperatif', 'Membantu', 'Mengajar'],
    careers: ['Guru', 'Perawat', 'Konselor', 'Pekerja Sosial', 'Manajer HR', 'Terapis'],
    majors: ['Psikologi', 'Ilmu Komunikasi', 'Pendidikan', 'Ilmu Keperawatan', 'Sosiologi', 'Kesejahteraan Sosial'],
  },
  E: {
    code: 'E',
    name: 'Enterprising (Si Pengusaha)',
    description: 'Kamu adalah seorang "Unternehmer" – pengusaha yang suka memimpin, membujuk, dan memengaruhi orang lain untuk mencapai tujuan atau keuntungan. Kamu ambisius, energik, dan percaya diri. Kamu suka mengambil inisiatif.',
    keywords: ['Membujuk', 'Ambisius', 'Pemimpin', 'Bisnis', 'Kompetitif'],
    careers: ['Pengusaha/Startup Founder', 'Manajer Penjualan', 'Pengacara', 'Politisi', 'Ahli Pemasaran', 'Manajer Proyek'],
    majors: ['Manajemen Bisnis', 'Ilmu Hukum', 'Ilmu Politik', 'Marketing', 'Hubungan Internasional', 'Kewirausahaan'],
  },
  C: {
    code: 'C',
    name: 'Conventional (Si Teratur)',
    description: 'Kamu adalah seorang "Ordner" – pengatur yang suka bekerja dengan data dan angka dalam lingkungan yang terstruktur. Kamu menghargai ketelitian, keteraturan, dan kejelasan. Kamu efisien, teliti, dan bertanggung jawab.',
    keywords: ['Terorganisir', 'Teliti', 'Data', 'Struktur', 'Efisien'],
    careers: ['Akuntan', 'Analis Data', 'Staf Administrasi', 'Ahli Perpajakan', 'Auditor', 'Developer Back-End'],
    majors: ['Akuntansi', 'Manajemen Keuangan', 'Sistem Informasi', 'Administrasi Bisnis', 'Statistika', 'Perpajakan'],
  },
};