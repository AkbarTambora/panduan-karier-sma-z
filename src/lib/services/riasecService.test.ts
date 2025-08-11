// src/lib/services/riasecService.test.ts

import { describe, it, expect, vi } from 'vitest'; // ✅ Add vi for mocking
import {
  processUserScores,
  getTopMatches,
  getPersonalizedMotivation
} from './riasecService';
import { motivations } from '@/data/motivations';
import type { UserProfile, GroupedRecommendations } from './riasecService';
import type { Major } from '@/data/majors'; 

// ✅ NEW: Mock MongoDB module
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

// ===================================================================
// KELOMPOK TES: processUserScores
// ===================================================================
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
    expect(result.personaName).toBe('Si Realistic yang Artistic');

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
    expect(result.personaName).toBe('Si Artistic yang Conventional'); 
  });

  // Skenario 3: Data Minim (Edge Case)
  it('SKENARIO 3: harus menangani data minim dengan baik tanpa error', () => {
    const mockRawScores = { R: '75' };

    const result = processUserScores(mockRawScores);

    expect(result.topThree).toEqual(['R']);
    expect(result.topTwoCode).toBe(''); // Tidak ada tipe kedua
    expect(result.personaName).toBe('Profil Unik'); // Sesuai guard clause di kodemu
  });
});

// ===================================================================
// KELOMPOK TES: getTopMatches
// ===================================================================
describe('getTopMatches', () => {

  it('SKENARIO 4: harus mengembalikan grouped recommendations', () => {
    const mockUserProfile: UserProfile = {
      topThree: ['A', 'S', 'E'],
    } as UserProfile;

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

    const result: GroupedRecommendations = getTopMatches(mockUserProfile, mockItems);

    expect(typeof result).toBe('object');
    
    const categories = Object.keys(result);
    expect(categories.length).toBeGreaterThan(0);
    
    for (const category of categories) {
      expect(Array.isArray(result[category])).toBe(true);
      expect(result[category].length).toBeGreaterThan(0);
    }

    const allItems = Object.values(result).flat();
    expect(allItems.length).toBe(5); // All 5 items should match
    
    const firstItem = allItems[0];
    expect(firstItem).toHaveProperty('id');
    expect(firstItem).toHaveProperty('name');
    expect(firstItem).toHaveProperty('matchScore');
    expect(firstItem).toHaveProperty('matchedType');
  });

  // SKENARIO 5: Empty Result
  it('SKENARIO 5: harus menangani kasus tidak ada item yang cocok', () => {
    const mockUserProfile: UserProfile = { topThree: ['I'] } as UserProfile;

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

    const result = getTopMatches(mockUserProfile, mockItems);

    expect(Object.keys(result).length).toBe(0);
  });
});

// ===================================================================
// KELOMPOK TES: getPersonalizedMotivation
// ===================================================================
describe('getPersonalizedMotivation', () => {

  // SKENARIO 7: Kode Terbalik
  it('SKENARIO 7: harus menemukan motivasi meskipun kodenya terbalik', () => {
    const userCode = 'IR';
    const expectedMotivation = motivations['RI'];

    const result = getPersonalizedMotivation(userCode);

    expect(result).toBe(expectedMotivation);
  });

  // SKENARIO 8: Default
  it('SKENARIO 8: harus mengembalikan motivasi default jika tidak ada yang cocok', () => {
    const userCode = 'XX';
    const expectedMotivation = motivations['DEFAULT'];

    const result = getPersonalizedMotivation(userCode);

    expect(result).toBe(expectedMotivation);
  });
});