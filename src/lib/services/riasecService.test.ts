// src/lib/services/riasecService.test.ts

import { describe, it, expect, vi } from 'vitest';
import {
  processUserScores,
  getTopMatches,
  getPersonalizedMotivation,
} from './riasecService';
import { motivations } from '@/data/motivations';
import type { UserProfile, MatchResult } from './riasecService';
import type { Major } from '@/data/majors';
import type { Career } from '@/data/careers';

vi.mock('@/lib/mongodb', () => {
  return {
    default: Promise.resolve({}),
  };
});

describe('processUserScores', () => {
  it('SKENARIO 1.1: Harus menghitung profil pengguna dengan benar dari skor mentah ideal', () => {
    const mockRawScores = { R: '75', I: '15', A: '60', S: '45', E: '30', C: '20' };
    const result: UserProfile = processUserScores(mockRawScores);
    expect(result.topThree).toEqual(['R', 'A', 'S']);
    expect(result.topTwoCode).toBe('RA');
    // PERBAIKAN: Sesuaikan ekspektasi dengan output bahasa Indonesia dari program
    expect(result.personaName).toBe('Si Realistis yang Kreatif'); 
    const realisticPercent = result.percentages.find((p) => p[0] === 'R');
    const investigativePercent = result.percentages.find((p) => p[0] === 'I');
    expect(realisticPercent?.[1]).toBe(100);
    expect(investigativePercent?.[1]).toBe(0);
  });

  it('SKENARIO 1.2: Harus mengurutkan dengan benar jika ada skor yang sama (tie)', () => {
    const mockRawScores = { R: '60', I: '20', A: '70', S: '30', E: '40', C: '70' };
    const result = processUserScores(mockRawScores);
    expect(result.topThree).toEqual(['A', 'C', 'R']);
    expect(result.topTwoCode).toBe('AC');
    // PERBAIKAN: Tambahkan ekspektasi yang hilang untuk kelengkapan tes
    expect(result.personaName).toBe('Si Kreatif yang Teratur');
  });

  it('SKENARIO 1.3: Harus menangani data minim dengan baik tanpa error', () => {
    const mockRawScores = { R: '75' };
    const result = processUserScores(mockRawScores);
    expect(result.topThree).toEqual(['R']);
    expect(result.topTwoCode).toBe('');
    expect(result.personaName).toBe('Profil Unik');
  });
});

describe('getTopMatches', () => {
  it('SKENARIO 2.1: Harus memilih 6 rekomendasi teratas dari pool gabungan tipe dominan', () => {
    const mockUserProfile: UserProfile = {
      scores: [['A', 75], ['S', 63], ['E', 51], ['C', 15], ['I', 15], ['R', 15]],
      percentages: [['A', 100], ['S', 80], ['E', 60], ['C', 0], ['I', 0], ['R', 0]],
      topThree: ['A', 'S', 'E'],
      topTwoCode: 'AS',
      personaName: 'Si Artistic yang Social',
    };
    const mockItems: (Major | Career)[] = [
      { id: 'DKV', name: 'Desain Komunikasi Visual', description: '', riasecProfile: { A: 10, R: 2, I: 4, S: 5, E: 6, C: 4 } },
      { id: 'MUSIK', name: 'Seni Musik', description: '', riasecProfile: { A: 9, R: 3, I: 3, S: 6, E: 5, C: 4 } },
      { id: 'PSIKO', name: 'Psikologi', description: '', riasecProfile: { S: 9, R: 2, I: 8, A: 5, E: 6, C: 4 } },
      { id: 'KOM', name: 'Ilmu Komunikasi', description: '', riasecProfile: { S: 8, A: 7, E: 8, R: 1, I: 4, C: 3 } },
      { id: 'BISNIS', name: 'Manajemen Bisnis', description: '', riasecProfile: { E: 9, S: 6, C: 8, R: 2, I: 4, A: 4 } },
      { id: 'HUKUM', name: 'Ilmu Hukum', description: '', riasecProfile: { E: 8, I: 7, C: 7, S: 5, A: 3, R: 1 } },
      { id: 'MESIN', name: 'Teknik Mesin', description: '', riasecProfile: { R: 9, I: 8, A: 2, S: 2, E: 4, C: 6 } },
    ];
    const result: MatchResult[] = getTopMatches(mockUserProfile, mockItems);
    expect(result.length).toBe(6);
    expect(result.find(m => m.id === 'MESIN')).toBeUndefined();
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].matchScore).toBeGreaterThanOrEqual(result[i + 1].matchScore);
    }
  });

  it('SKENARIO 2.2: Harus mengembalikan kurang dari 6 item jika kandidat yang relevan memang sedikit', () => {
    const mockUserProfile: UserProfile = { percentages: [['R', 90], ['S', 80], ['C', 70]], topThree: ['R', 'S', 'C'] } as UserProfile;
    const mockItems: (Major | Career)[] = [
      { id: 'R1', name: 'Teknik Mesin', description: '', riasecProfile: { R: 9, S: 1, C: 1, I: 1, A: 1, E: 1 } },
      { id: 'S1', name: 'Pekerja Sosial', description: '', riasecProfile: { S: 9, R: 1, C: 1, I: 1, A: 1, E: 1 } },
      { id: 'C1', name: 'Akuntansi', description: '', riasecProfile: { C: 9, R: 1, S: 1, I: 1, A: 1, E: 1 } },
      { id: 'A1', name: 'Desain', description: '', riasecProfile: { A: 9, R: 1, S: 1, C: 1, I: 1, E: 1 } },
    ];
    const result = getTopMatches(mockUserProfile, mockItems);
    expect(result.length).toBe(3);
  });

  it('SKENARIO 2.3: Harus mengembalikan array kosong jika tidak ada item yang cocok', () => {
    const mockUserProfile: UserProfile = { topThree: ['R', 'I', 'A'] } as UserProfile;
    const mockItems: (Major | Career)[] = [
      { id: 'S1', name: 'Pekerja Sosial', description: '', riasecProfile: { S: 9, R: 1, C: 1, I: 1, A: 1, E: 1 } },
      { id: 'E1', name: 'Bisnis', description: '', riasecProfile: { E: 9, R: 1, C: 1, I: 1, A: 1, S: 1 } },
      { id: 'C1', name: 'Akuntansi', description: '', riasecProfile: { C: 9, R: 1, S: 1, I: 1, A: 1, E: 1 } },
    ];
    const result = getTopMatches(mockUserProfile, mockItems);
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});

describe('getPersonalizedMotivation', () => {
  it('SKENARIO 3.1: Harus mengembalikan motivasi yang benar untuk kode yang ada', () => {
    const userCode = 'RI';
    const expectedMotivation = motivations['RI'];
    const result = getPersonalizedMotivation(userCode);
    expect(result).toBe(expectedMotivation);
  });
  
  it('SKENARIO 3.2: Harus menemukan motivasi meskipun kodenya terbalik', () => {
    const userCode = 'IR';
    const expectedMotivation = motivations['RI'];
    const result = getPersonalizedMotivation(userCode);
    expect(result).toBe(expectedMotivation);
  });

  it('SKENARIO 3.3: Harus mengembalikan motivasi default jika tidak ada yang cocok sama sekali', () => {
    const userCode = 'XX';
    const expectedMotivation = motivations['DEFAULT'];
    const result = getPersonalizedMotivation(userCode);
    expect(result).toBe(expectedMotivation);
  });
});