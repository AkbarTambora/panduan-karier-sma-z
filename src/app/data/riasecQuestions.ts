// src/data/riasecQuestions.ts

export type RiasecType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface Question {
  id: number;
  text: string;
  type: RiasecType;
}

export const riasecQuestions: Question[] = [
  // Realistic (R)
  { id: 1, text: "Saya suka bekerja dengan peralatan atau mesin.", type: 'R' },
  { id: 2, text: "Saya suka memperbaiki barang-barang elektronik.", type: 'R' },
  { id: 3, text: "Saya lebih suka bekerja di luar ruangan daripada di dalam kantor.", type: 'R' },
  { id: 4, text: "Saya senang membangun atau merakit sesuatu.", type: 'R' },
  { id: 5, text: "Saya tertarik pada bidang otomotif atau konstruksi.", type: 'R' },

  // Investigative (I)
  { id: 6, text: "Saya senang memecahkan masalah yang rumit dan analitis.", type: 'I' },
  { id: 7, text: "Saya menikmati melakukan penelitian untuk menemukan fakta baru.", type: 'I' },
  { id: 8, text: "Saya tertarik pada mata pelajaran sains dan matematika.", type: 'I' },
  { id: 9, text: "Saya suka membaca artikel ilmiah atau buku non-fiksi.", type: 'I' },
  { id: 10, text: "Saya sering bertanya 'mengapa' tentang cara kerja sesuatu.", type: 'I' },

  // Artistic (A)
  { id: 11, text: "Saya memiliki imajinasi yang kuat.", type: 'A' },
  { id: 12, text: "Saya menikmati kegiatan seperti melukis, menulis, atau bermain musik.", type: 'A' },
  { id: 13, text: "Saya suka mencari cara baru untuk mengekspresikan ide.", type: 'A' },
  { id: 14, text: "Saya tidak suka pekerjaan dengan aturan yang terlalu kaku.", type: 'A' },
  { id: 15, text: "Saya menghargai keindahan dalam seni dan desain.", type: 'A' },

  // Social (S)
  { id: 16, text: "Saya suka membantu atau mengajar orang lain.", type: 'S' },
  { id: 17, text: "Saya pandai mendengarkan dan memahami perasaan orang lain.", type: 'S' },
  { id: 18, text: "Saya senang bekerja dalam tim untuk mencapai tujuan bersama.", type: 'S' },
  { id: 19, text: "Saya tertarik pada pekerjaan sosial atau konseling.", type: 'S' },
  { id: 20, text: "Saya merasa puas ketika bisa membuat perbedaan dalam kehidupan seseorang.", type: 'S' },

  // Enterprising (E)
  { id: 21, text: "Saya suka memimpin sebuah tim atau proyek.", type: 'E' },
  { id: 22, text: "Saya pandai meyakinkan atau bernegosiasi dengan orang lain.", type: 'E' },
  { id: 23, text: "Saya tertarik untuk memulai bisnis saya sendiri suatu hari nanti.", type: 'E' },
  { id: 24, text: "Saya berani mengambil risiko untuk mendapatkan keuntungan.", type: 'E' },
  { id: 25, text: "Saya suka berbicara di depan umum atau presentasi.", type: 'E' },

  // Conventional (C)
  { id: 26, text: "Saya suka bekerja dengan data dan angka secara teratur.", type: 'C' },
  { id: 27, text: "Saya orang yang rapi, terorganisir, dan teliti.", type: 'C' },
  { id: 28, text: "Saya lebih suka mengikuti instruksi yang jelas daripada membuat aturan sendiri.", type: 'C' },
  { id: 29, text: "Saya menikmati tugas-tugas yang membutuhkan ketelitian, seperti akuntansi atau manajemen data.", type: 'C' },
  { id: 30, text: "Saya merasa nyaman dengan rutinitas dan pekerjaan yang terstruktur.", type: 'C' },
];