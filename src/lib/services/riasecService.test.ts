// src/lib/services/riasecService.test.ts

import { describe, it, expect, vi } from 'vitest';
import {
  processUserScores,
  getCuratedMatches,      // ✅ FIXED: nama fungsi yang benar
  getPersonalizedMotivation,
} from './riasecService';
import { motivations } from '@/data/motivations';
import type { UserProfile, CuratedRecommendations } from './riasecService'; // ✅ FIXED: tipe yang benar
import type { Major } from '@/data/majors'; 

// ✅ FIXED: Satu mock saja, tidak duplikat
vi.mock('@/lib/mongodb', () => ({
  default: Promise.resolve({
    db: vi.fn().mockReturnValue({
      collection: vi.fn().mockReturnValue({
        find: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue([])
        })
      })
    })
  })
}));

describe('processUserScores', () => {

  // Skenario 1: Kasus Ideal
  it('SKENARIO 1: harus menghitung profil pengguna dengan benar dari skor mentah ideal', () => {
    const mockRawScores = {
      R: '75', // Skor max -> 100%
      I: '15', // Skor min -> 0%
      A: '60', // (60-15)/(75-15) * 100 = 75%
      S: '45', // (45-15)/(75-15) * 100 = 50%
      E: '30', // (30-15)/(75-15) * 100 = 25%
      C: '20', // Skor tidak signifikan
    };

    const result: UserProfile = processUserScores(mockRawScores);

    expect(result.topThree).toEqual(['R', 'A', 'S']);
    expect(result.topTwoCode).toBe('RA');
    // ✅ FIXED: sekarang nama Indonesia yang digunakan
    expect(result.personaName).toBe('Si Realistis yang Kreatif');

    const realisticPercent = result.percentages.find(p => p[0] === 'R');
    const investigativePercent = result.percentages.find(p => p[0] === 'I');

    expect(realisticPercent?.[1]).toBe(100);
    expect(investigativePercent?.[1]).toBe(0);
  });

  // Skenario 2: Skor Sama (Tie-breaking)
  it('SKENARIO 2: harus mengurutkan berdasarkan abjad jika ada skor yang sama', () => {
    const mockRawScores = {
      R: '60',
      I: '20',
      A: '70',
      S: '30',
      E: '40',
      C: '70',
    };

    const result = processUserScores(mockRawScores);

    expect(result.topThree).toEqual(['A', 'C', 'R']);
    expect(result.topTwoCode).toBe('AC');
    // ✅ FIXED: nama Indonesia yang benar
    expect(result.personaName).toBe('Si Kreatif yang Teratur');
  });

  // Skenario 3: Data Minim (Edge Case)
  it('SKENARIO 3: harus menangani data minim dengan baik tanpa error', () => {
    const mockRawScores = { R: '75' };

    const result = processUserScores(mockRawScores);

    expect(result.topThree).toEqual(['R']);
    expect(result.topTwoCode).toBe('');
    expect(result.personaName).toBe('Profil Unik');
  });

  // Skenario 4: Validasi NaN
  it('SKENARIO 4: harus mengabaikan nilai non-numerik dari URL params', () => {
    const mockRawScores = {
      R: '75',
      I: 'abc',    // ❌ non-numerik — harus diabaikan
      A: '60',
      S: '45',
      E: 'undefined', // ❌ non-numerik
      C: '20',
    };

    const result = processUserScores(mockRawScores);

    // Pastikan tidak ada NaN dalam scores
    for (const [, score] of result.scores) {
      expect(isNaN(score)).toBe(false);
    }
    // Tipe I dan E tidak masuk karena NaN
    expect(result.scores.find(([t]) => t === 'I')).toBeUndefined();
    expect(result.scores.find(([t]) => t === 'E')).toBeUndefined();
  });

  // Skenario 5: Clamp nilai di luar range
  it('SKENARIO 5: normalisasi skor tidak boleh menghasilkan nilai negatif atau > 100', () => {
    const mockRawScores = {
      R: '100', // > maxScorePerType (75), harus clamp ke 100%
      I: '0',   // < minScorePerType (15), harus clamp ke 0%
      A: '45',
      S: '30',
      E: '25',
      C: '20',
    };

    const result = processUserScores(mockRawScores);

    for (const [, pct] of result.percentages) {
      expect(pct).toBeGreaterThanOrEqual(0);
      expect(pct).toBeLessThanOrEqual(100);
    }
  });
});

describe('getCuratedMatches', () => {

  it('SKENARIO 6: harus mengembalikan curated recommendations dengan topPicks dan alternatives', () => {
    const mockUserProfile: UserProfile = {
      scores: [['A', 75], ['S', 63], ['E', 51], ['C', 15], ['I', 15], ['R', 15]],
      percentages: [['A', 100], ['S', 80], ['E', 60], ['C', 0], ['I', 0], ['R', 0]],
      topThree: ['A', 'S', 'E'],
      topTwoCode: 'AS',
      personaName: 'Si Kreatif yang Penolong',
    };

    const mockItems: Major[] = [
      { 
        id: 'A1', 
        name: 'Desain Grafis', 
        description: '', 
        field: 'Seni',
        subField: 'Seni Digital & Media',
        riasecProfile: { A: 9, S: 1, E: 1, R: 1, I: 1, C: 1 } 
      },
      { 
        id: 'A2', 
        name: 'Seni Musik', 
        description: '', 
        field: 'Seni',
        subField: 'Seni Pertunjukan',
        riasecProfile: { A: 8, S: 1, E: 1, R: 1, I: 1, C: 1 } 
      },
      { 
        id: 'S1', 
        name: 'Psikologi', 
        description: '', 
        field: 'Sosial',
        subField: 'Ilmu Sosial & Humaniora',
        riasecProfile: { S: 9, A: 1, E: 1, R: 1, I: 1, C: 1 } 
      },
      { 
        id: 'S2', 
        name: 'Sosiologi', 
        description: '', 
        field: 'Sosial',
        subField: 'Ilmu Sosial & Humaniora',
        riasecProfile: { S: 8, A: 1, E: 1, R: 1, I: 1, C: 1 } 
      },
      { 
        id: 'E1', 
        name: 'Manajemen Bisnis', 
        description: '', 
        field: 'Bisnis',
        subField: 'Bisnis & Kewirausahaan',
        riasecProfile: { E: 9, A: 1, S: 1, R: 1, I: 1, C: 1 } 
      },
    ];

    const result: CuratedRecommendations = getCuratedMatches(mockUserProfile, mockItems);

    // Pastikan struktur curated ada
    expect(result).toHaveProperty('topPicks');
    expect(result).toHaveProperty('alternatives');
    expect(result).toHaveProperty('totalCount');
    
    // totalCount harus sama dengan total item yang cocok (5 item)
    expect(result.totalCount).toBe(5);

    // topPicks: max 3 kategori, masing-masing 1 item
    const topPickCategories = Object.keys(result.topPicks);
    expect(topPickCategories.length).toBeLessThanOrEqual(3);
    
    for (const category of topPickCategories) {
      expect(Array.isArray(result.topPicks[category])).toBe(true);
      expect(result.topPicks[category].length).toBe(1); // Hanya 1 item per top pick
      
      const item = result.topPicks[category][0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('matchScore');
      expect(item).toHaveProperty('confidenceScore');
      expect(item).toHaveProperty('matchedType');
      expect(item).toHaveProperty('reasoning');
    }
  });

  // Skenario: Empty Result
  it('SKENARIO 7: harus menangani kasus tidak ada item yang cocok', () => {
    const mockUserProfile: UserProfile = {
      scores: [['I', 75]],
      percentages: [['I', 100]],
      topThree: ['I'],
      topTwoCode: '',
      personaName: 'Si Pemikir yang Unik',
    };

    const mockItems: Major[] = [
      { 
        id: 'R1', 
        name: 'Teknik Mesin', 
        description: '', 
        field: 'Teknik',
        subField: 'Teknik Mekanik',
        riasecProfile: { R: 9, I: 1, A: 1, S: 1, E: 1, C: 1 } 
      },
    ];

    const result = getCuratedMatches(mockUserProfile, mockItems);

    expect(Object.keys(result.topPicks).length).toBe(0);
    expect(result.totalCount).toBe(0);
  });
});

describe('getPersonalizedMotivation', () => {

  // Skenario: Kode Terbalik
  it('SKENARIO 8: harus menemukan motivasi meskipun kodenya terbalik', () => {
    const userCode = 'IR';
    const expectedMotivation = motivations['RI'];

    const result = getPersonalizedMotivation(userCode);

    expect(result).toBe(expectedMotivation);
  });

  // Skenario: Default
  it('SKENARIO 9: harus mengembalikan motivasi default jika tidak ada yang cocok', () => {
    const userCode = 'XX';
    const expectedMotivation = motivations['DEFAULT'];

    const result = getPersonalizedMotivation(userCode);

    expect(result).toBe(expectedMotivation);
  });
});