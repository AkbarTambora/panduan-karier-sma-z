// Import dari majors.ts yang sekarang sudah mengekspor tipe yang benar
import type { RiasecScoreProfile } from './majors';

export interface Career {
  id: string;
  name: string;
  description: string;
  riasecProfile: RiasecScoreProfile;
}
export const careers: Career[] = [
  // Karier dengan dominan 'I'
  {
    id: 'DS01',
    name: 'Ilmuwan Data (Data Scientist)',
    description: 'Menganalisis data kompleks untuk menemukan tren dan wawasan yang dapat digunakan untuk pengambilan keputusan.',
    riasecProfile: { R: 2, I: 10, A: 4, S: 4, E: 6, C: 7 }
  },
  {
    id: 'PG01',
    name: 'Programmer / Software Developer',
    description: 'Merancang, menulis, dan memelihara kode untuk menciptakan aplikasi perangkat lunak.',
    riasecProfile: { R: 4, I: 9, A: 5, S: 3, E: 4, C: 8 }
  },
  // Karier dengan dominan 'R'
  {
    id: 'CH01',
    name: 'Chef Profesional',
    description: 'Memimpin dapur, menciptakan menu, dan memastikan kualitas makanan yang disajikan.',
    riasecProfile: { R: 8, I: 3, A: 7, S: 5, E: 6, C: 4 }
  },
  // Karier dengan dominan 'A'
  {
    id: 'GD01',
    name: 'Desainer Grafis',
    description: 'Menciptakan konsep visual untuk mengkomunikasikan ide yang menginspirasi, menginformasikan, atau memikat konsumen.',
    riasecProfile: { R: 2, I: 3, A: 10, S: 4, E: 6, C: 5 }
  },
  // Karier dengan dominan 'S'
  {
    id: 'CNS01',
    name: 'Konselor Sekolah',
    description: 'Membantu siswa dengan masalah akademik, pribadi, dan sosial, serta membimbing perencanaan karier mereka.',
    riasecProfile: { R: 1, I: 7, A: 5, S: 10, E: 6, C: 4 }
  },
  // Karier dengan dominan 'E'
  {
    id: 'ENT01',
    name: 'Pengusaha (Entrepreneur)',
    description: 'Membangun dan menjalankan bisnis sendiri, mengambil risiko finansial dengan harapan mendapat keuntungan.',
    riasecProfile: { R: 4, I: 5, A: 6, S: 6, E: 10, C: 7 }
  },
  // Karier dengan dominan 'C'
  {
    id: 'ACC01',
    name: 'Akuntan Publik',
    description: 'Memeriksa catatan keuangan untuk memastikan akurasi dan kepatuhan terhadap hukum dan peraturan.',
    riasecProfile: { R: 1, I: 6, A: 2, S: 4, E: 5, C: 10 }
  },
];