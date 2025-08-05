// src/data/majors.ts

import type { RiasecType } from './riasecQuestions';

// Menggunakan skala 1-10 untuk mempermudah pembobotan
// Export tipe ini agar bisa digunakan di file lain
export type RiasecScoreProfile = { [key in RiasecType]: number };

export interface Major {
  id: string;
  name: string;
  description: string;
  riasecProfile: RiasecScoreProfile;
}

export const majors: Major[] = [
  // Jurusan dengan dominan 'I'
  {
    id: 'CS01',
    name: 'Ilmu Komputer',
    description: 'Mempelajari desain dan pengembangan sistem komputasi, perangkat lunak, dan jaringan.',
    riasecProfile: { R: 4, I: 9, A: 5, S: 3, E: 4, C: 7 }
  },
  {
    id: 'MD01',
    name: 'Kedokteran',
    description: 'Mempelajari ilmu medis untuk mendiagnosis, mengobati, dan mencegah penyakit pada manusia.',
    riasecProfile: { R: 4, I: 9, A: 3, S: 8, E: 4, C: 6 }
  },
  // Jurusan dengan dominan 'R'
  {
    id: 'ME01',
    name: 'Teknik Mesin',
    description: 'Fokus pada desain, manufaktur, dan pemeliharaan sistem mekanik menggunakan prinsip fisika dan material.',
    riasecProfile: { R: 9, I: 8, A: 2, S: 2, E: 4, C: 6 }
  },
  // Jurusan dengan dominan 'A'
  {
    id: 'DKV01',
    name: 'Desain Komunikasi Visual',
    description: 'Menggabungkan seni dan teknologi untuk menyampaikan pesan melalui media visual seperti grafis, video, dan web.',
    riasecProfile: { R: 3, I: 4, A: 9, S: 5, E: 6, C: 4 }
  },
  // Jurusan dengan dominan 'S'
  {
    id: 'PS01',
    name: 'Psikologi',
    description: 'Mempelajari perilaku dan proses mental manusia, serta penerapannya untuk membantu individu dan kelompok.',
    riasecProfile: { R: 2, I: 8, A: 5, S: 9, E: 6, C: 4 }
  },
  // Jurusan dengan dominan 'E'
  {
    id: 'BM01',
    name: 'Manajemen Bisnis',
    description: 'Mempelajari cara merencanakan, mengorganisir, dan mengelola sumber daya untuk mencapai tujuan bisnis.',
    riasecProfile: { R: 2, I: 4, A: 4, S: 6, E: 9, C: 8 }
  },
  // Jurusan dengan dominan 'C'
  {
    id: 'AC01',
    name: 'Akuntansi',
    description: 'Mempelajari pengukuran, pemrosesan, dan komunikasi informasi keuangan suatu entitas bisnis.',
    riasecProfile: { R: 2, I: 5, A: 2, S: 4, E: 6, C: 9 }
  },
];