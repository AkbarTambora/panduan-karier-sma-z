// src/lib/services/riasecService.test.ts

import { describe, it, expect } from 'vitest';
import {
  processUserScores,
  getTopMatches,
  getPersonalizedMotivation
} from './riasecService';
import { motivations } from '@/data/motivations';
import type { UserProfile, MatchResult } from './riasecService';
// Impor tipe data asli untuk membuat mock yang valid
import type { Major } from '@/data/majors'; 
import type { Career } from '@/data/careers';

// ===================================================================
// KELOMPOK TES: processUserScores
// ===================================================================
describe('processUserScores', () => {

  // Skenario 1: Kasus Ideal
  it('SKENARIO 1: harus menghitung profil pengguna dengan benar dari skor mentah ideal', () => {
    // ATUR (Arrange): Siapkan data input yang terkontrol.
    // Nilai skor mentah berasal dari jawaban 1-5, dengan 15 pertanyaan per tipe.
    // Min skor: 15*1=15. Max skor: 15*5=75.
    const mockRawScores = {
      R: '75', // Skor max -> 100%
      I: '15', // Skor min -> 0%
      A: '60', // (60-15)/(75-15) * 100 = 75%
      S: '45', // (45-15)/(75-15) * 100 = 50%
      E: '30', // (30-15)/(75-15) * 100 = 25%
      C: '20', // Skor tidak signifikan
    };

    // AKSI (Act): Jalankan fungsi yang diuji.
    const result: UserProfile = processUserScores(mockRawScores);

    // ASERSi (Assert): Verifikasi setiap bagian dari output.
    expect(result.topThree).toEqual(['R', 'A', 'S']);
    expect(result.topTwoCode).toBe('RA');
    expect(result.personaName).toBe('Si Realistic yang Artistic');

    // Cek persentase dengan .find() agar lebih aman
    const realisticPercent = result.percentages.find(p => p[0] === 'R');
    const artisticPercent = result.percentages.find(p => p[0] === 'A');
    const socialPercent = result.percentages.find(p => p[0] === 'S');
    const investigativePercent = result.percentages.find(p => p[0] === 'I');

    expect(realisticPercent?.[1]).toBe(100);
    expect(artisticPercent?.[1]).toBe(75);
    expect(socialPercent?.[1]).toBe(50);
    expect(investigativePercent?.[1]).toBe(0);
  });

  // Skenario 2: Skor Sama (Tie-breaking)
  it('SKENARIO 2: harus mengurutkan berdasarkan abjad jika ada skor yang sama', () => {
    // ATUR: A dan C memiliki skor yang sama (70). R di posisi ketiga.
    const mockRawScores = {
      R: '60',
      I: '20',
      A: '70',
      S: '30',
      E: '40',
      C: '70',
    };

    // AKSI
    const result = processUserScores(mockRawScores);

    // ASERSi: Urutan skor mentah harus A(70), C(70), R(60), ...
    // Karena A datang sebelum C secara alfabetis, `topThree` harus ['A', 'C', 'R'].
    expect(result.topThree).toEqual(['A', 'C', 'R']);
    expect(result.topTwoCode).toBe('AC');
    expect(result.personaName).toBe('Si Artistic yang Conventional'); 
  });

  // Skenario 3: Data Minim (Edge Case)
  it('SKENARIO 3: harus menangani data minim dengan baik tanpa error', () => {
    // ATUR: Bayangkan pengguna hanya menjawab pertanyaan untuk tipe R.
    const mockRawScores = { R: '75' };

    // AKSI
    const result = processUserScores(mockRawScores);

    // ASERSi: Program harus tetap berjalan dan memberikan output yang 'aman'.
    expect(result.topThree).toEqual(['R']);
    expect(result.topTwoCode).toBe(''); // Tidak ada tipe kedua
    expect(result.personaName).toBe('Profil Unik'); // Sesuai guard clause di kodemu
  });
});

// ===================================================================
// KELOMPOK TES: getTopMatches
// ===================================================================
describe('getTopMatches', () => {

  it('SKENARIO 4: harus mengembalikan 3-2-1 rekomendasi sesuai tipe teratas', () => {
    // ATUR (Arrange)
    const mockUserProfile: UserProfile = {
      topThree: ['A', 'S', 'E'],
    } as UserProfile;

    // 2. BUAT MOCK DATA YANG VALID SESUAI TIPE 'Major' / 'Career'
    const mockItems: (Major | Career)[] = [
      // 3 item Artistik (harus terpilih semua)
      { id: 'A1', name: 'Desain', description: '', riasecProfile: { A: 9, S: 1, E: 1, R: 1, I: 1, C: 1 } },
      { id: 'A2', name: 'Musik', description: '', riasecProfile: { A: 8, S: 1, E: 1, R: 1, I: 1, C: 1 } },
      { id: 'A3', name: 'Seni Rupa', description: '', riasecProfile: { A: 7, S: 1, E: 1, R: 1, I: 1, C: 1 } },
      // 3 item Sosial (hanya 2 teratas yang harus terpilih)
      { id: 'S1', name: 'Psikologi', description: '', riasecProfile: { S: 9, A: 1, E: 1, R: 1, I: 1, C: 1 } },
      { id: 'S2', name: 'Pendidikan', description: '', riasecProfile: { S: 8, A: 1, E: 1, R: 1, I: 1, C: 1 } },
      { id: 'S3', name: 'Sosiologi', description: '', riasecProfile: { S: 7, A: 1, E: 1, R: 1, I: 1, C: 1 } },
      // 2 item Enterprising (hanya 1 teratas yang harus terpilih)
      { id: 'E1', name: 'Bisnis', description: '', riasecProfile: { E: 9, A: 1, S: 1, R: 1, I: 1, C: 1 } },
      { id: 'E2', name: 'Manajemen', description: '', riasecProfile: { E: 8, A: 1, S: 1, R: 1, I: 1, C: 1 } },
      // 1 item Realistis (tidak boleh terpilih)
      { id: 'R1', name: 'Teknik', description: '', riasecProfile: { R: 9, A: 1, S: 1, E: 1, I: 1, C: 1 } },
    ];

    // AKSI (Act)
    // 3. DEKLARASIKAN TIPE 'result' DAN HILANGKAN 'as any'
    const result: MatchResult[] = getTopMatches(mockUserProfile, mockItems);

    // ASERSi (Assert) - Tidak ada perubahan di sini
    expect(result.length).toBe(6);

    const artisticMatches = result.filter(m => m.matchedType === 'A');
    const socialMatches = result.filter(m => m.matchedType === 'S');
    const enterprisingMatches = result.filter(m => m.matchedType === 'E');

    expect(artisticMatches.length).toBe(3);
    expect(socialMatches.length).toBe(2);
    expect(enterprisingMatches.length).toBe(1);

    const realisticMatch = result.find(m => m.id === 'R1');
    expect(realisticMatch).toBeUndefined();
  });

  // SKENARIO 5: Anti-Duplikat
  it('SKENARIO 5: tidak boleh merekomendasikan item yang sama dua kali', () => {
    // ATUR: Pengguna kita adalah I, A, C.
    // Kita buat item 'Sistem Informasi' yang dominan 'I' tapi juga punya nilai 'C' yang tinggi.
    const mockUserProfile: UserProfile = { topThree: ['I', 'A', 'C'] } as UserProfile;
    
    const mockItems: (Major | Career)[] = [
      // 3 item I (termasuk SI)
      { id: 'I1', name: 'Ilmu Komputer', description: '', riasecProfile: { I: 9, A: 1, C: 1, R: 1, S: 1, E: 1 } },
      { id: 'SI', name: 'Sistem Informasi', description: '', riasecProfile: { I: 8, A: 1, C: 7, R: 1, S: 1, E: 1 } },
      { id: 'I3', name: 'Kedokteran', description: '', riasecProfile: { I: 7, A: 1, C: 1, R: 1, S: 1, E: 1 } },
      // 1 item A
      { id: 'A1', name: 'DKV', description: '', riasecProfile: { A: 9, I: 1, C: 1, R: 1, S: 1, E: 1 } },
      // 3 item C (termasuk SI lagi jika tidak ada anti-duplikat)
      { id: 'C1', name: 'Akuntansi', description: '', riasecProfile: { C: 9, I: 1, A: 1, R: 1, S: 1, E: 1 } },
      // Kita hapus 'SI' dari sini untuk memastikan tesnya valid. Logika anti-duplikat di kode Anda akan mencegahnya.
    ];

    // AKSI
    const result = getTopMatches(mockUserProfile, mockItems);

    // ASERSi
    // Harusnya SI hanya muncul sekali, yaitu dari kategori I (karena lebih tinggi prio-nya)
    const siMatches = result.filter(item => item.id === 'SI');
    expect(siMatches.length).toBe(1);

    // Total rekomendasi harusnya 3(I) + 2(A) + 1(C).
    // Karena item A cuma ada 1, dan item C cuma ada 1, maka totalnya jadi 3+1+1 = 5
    expect(result.length).toBe(5);
  });

  
  // SKENARIO 6: Data Tidak Ada
  it('SKENARIO 6: harus tetap berjalan jika tidak ada item yang cocok untuk satu tipe', () => {
    // ATUR: Pengguna kita adalah R, S, C. Tapi kita tidak menyediakan item S sama sekali.
    const mockUserProfile: UserProfile = { topThree: ['R', 'S', 'C'] } as UserProfile;

    const mockItems: (Major | Career)[] = [
      // 3 item R
      { id: 'R1', name: 'Teknik Mesin', description: '', riasecProfile: { R: 9, S: 1, C: 1, I: 1, A: 1, E: 1 } },
      { id: 'R2', name: 'Teknik Sipil', description: '', riasecProfile: { R: 8, S: 1, C: 1, I: 1, A: 1, E: 1 } },
      { id: 'R3', name: 'Penerbangan', description: '', riasecProfile: { R: 7, S: 1, C: 1, I: 1, A: 1, E: 1 } },
      // 0 item S --> sengaja dikosongkan
      // 1 item C
      { id: 'C1', name: 'Akuntansi', description: '', riasecProfile: { C: 9, R: 1, S: 1, I: 1, A: 1, E: 1 } },
    ];

    // AKSI
    const result = getTopMatches(mockUserProfile, mockItems);

    // ASERSi
    // Harusnya tidak ada error, dan hasilnya berisi item dari R dan C
    const socialMatches = result.filter(item => item.matchedType === 'S');
    expect(socialMatches.length).toBe(0);

    // Total rekomendasi: 3 dari R, 0 dari S, 1 dari C = 4
    expect(result.length).toBe(4);
    });
});

// ===================================================================
// KELOMPOK TES: getPersonalizedMotivation
// ===================================================================
describe('getPersonalizedMotivation', () => {

  // SKENARIO 7: Kode Terbalik
  it('SKENARIO 7: harus menemukan motivasi meskipun kodenya terbalik', () => {
    // ATUR: Kita tahu di data kita ada 'RI', tapi mungkin tidak ada 'IR'.
    // Tes ini memastikan jika pengguna mendapat hasil 'IR', mereka tetap dapat motivasi 'RI'.
    const userCode = 'IR';
    const expectedMotivation = motivations['RI']; // Kita harapkan hasil dari 'RI'

    // AKSI
    const result = getPersonalizedMotivation(userCode);

    // ASERSi
    expect(result).toBe(expectedMotivation);
  });

  // SKENARIO 8: Default
  it('SKENARIO 8: harus mengembalikan motivasi default jika tidak ada yang cocok', () => {
    // ATUR: Kita gunakan kode yang pasti tidak ada di data.
    const userCode = 'XX'; // Kode tidak valid
    const expectedMotivation = motivations['DEFAULT']; // Kita harapkan pesan default

    // AKSI
    const result = getPersonalizedMotivation(userCode);

    // ASERSi
    expect(result).toBe(expectedMotivation);
  });
});