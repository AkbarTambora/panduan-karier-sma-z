// src/lib/services/riasecService.ts

import type { RiasecType } from '@/data/riasecQuestions';
// --- PERBAIKAN: Impor tipe yang dibutuhkan ---
import type { Career } from '@/data/careers';
import type { Major, RiasecScoreProfile } from '@/data/majors'; // <-- Buka kembali RiasecScoreProfile
import { motivations } from '@/data/motivations';
import { riasecDetails } from '@/data/riasecDescriptions';
import clientPromise from '@/lib/mongodb';

// Tipe data yang akan kita gunakan di seluruh service
type RiasecScoreTuple = [RiasecType, number];

// --- Tipe-tipe ini diekspor agar halaman 'hasil' bisa menggunakannya ---
export interface UserProfile {
  scores: RiasecScoreTuple[];
  percentages: RiasecScoreTuple[];
  topThree: RiasecType[];
  topTwoCode: string;
  personaName: string;
}

export interface MatchResult {
  id: string;
  name: string;
  description: string;
  matchedType: RiasecType; // Tipe dominan pengguna yang cocok dengan item ini
  riasecProfile: RiasecScoreProfile;
}

export interface AnalysisReport {
  userProfile: UserProfile;
  majorMatches: MatchResult[];
  careerMatches: MatchResult[];
  motivation: string;
}

// --- Enum nilai, BUKAN tipe. Kita akan gunakan untuk validasi dan iterasi ---
const RIASEC_TYPES: RiasecType[] = ['R', 'I', 'A', 'S', 'E', 'C'];

/**
 * Fungsi utama yang dipanggil oleh halaman Hasil.
 * PERBAIKAN: Ubah tipe parameter menjadi lebih spesifik.
 */
export async function getAnalysisReport(rawScores: { [key: string]: string }): Promise<AnalysisReport> {
  
  const mongoClient = await clientPromise;
  const dbName = process.env.MONGODB_DB_NAME;
  if (!dbName) {
    throw new Error("Missing environment variable: MONGODB_DB_NAME");
  }
  const db = mongoClient.db(dbName);

  const [majorsData, careersData] = await Promise.all([
    db.collection<Major>('majors').find({}).toArray(),
    db.collection<Career>('careers').find({}).toArray()
  ]);

  // --- PERBAIKAN: Ganti 'processUserucers' menjadi 'processUserScores' ---
  const userProfile = processUserScores(rawScores);
  
  const majorMatches = getTopMatches(userProfile, majorsData);
  const careerMatches = getTopMatches(userProfile, careersData);
  const motivation = getPersonalizedMotivation(userProfile.topTwoCode);

  return {
    userProfile,
    majorMatches,
    careerMatches,
    motivation,
  };
}

// --- Fungsi Helper ---

/**
 * PERBAIKAN: Ubah tipe parameter di sini juga.
 * Sekarang fungsi ini menerima objek JS biasa, sehingga looping menjadi aman.
 */

export function processUserScores(rawScores: { [key:string]: string }): UserProfile {
  const scoresMap: Partial<{ [key in RiasecType]: number }> = {};
  
   // ✅ Loop ini sekarang AMAN karena `rawScores` bukan lagi proxy object.
  for (const key in rawScores) {
    if (RIASEC_TYPES.includes(key as RiasecType)) {
      // ✅ Akses ini juga AMAN.
      scoresMap[key as RiasecType] = Number(rawScores[key]);
    }
  }

  const sortedScores: RiasecScoreTuple[] = (Object.entries(scoresMap) as RiasecScoreTuple[])
    .sort(([, a], [, b]) => b - a);

  const minScorePerType = 15;
  const maxScorePerType = 75;
  
  const percentages: RiasecScoreTuple[] = sortedScores.map(([type, score]) => {
    const normalizedScore = ((score - minScorePerType) / (maxScorePerType - minScorePerType)) * 100;
    return [type, Math.round(normalizedScore)];
  });

  const topThree = sortedScores.slice(0, 3).map(([type]) => type);
  const topTwoCode = topThree.slice(0, 2).join('');
  
  // Guard clause jika data tidak lengkap
  if (!topThree[0] || !topThree[1]) {
    return {
        scores: sortedScores,
        percentages,
        topThree,
        topTwoCode: '',
        personaName: 'Profil Unik'
    }
  }

  const dominantTypeInfo = riasecDetails[topThree[0]];
  const secondaryTypeInfo = riasecDetails[topThree[1]];
  
  // Dengan logika yang lebih cerdas ini:
  const dominantPersona = dominantTypeInfo.name.match(/\((.*?)\)/)?.[1] || dominantTypeInfo.name.split(' ')[0];
  const secondaryPersona = secondaryTypeInfo.name.match(/\((.*?)\)/)?.[1] || secondaryTypeInfo.name.split(' ')[0];
  const secondaryPersonaClean = secondaryPersona.replace('Si ', '');
  const personaName = `${dominantPersona} yang ${secondaryPersonaClean}`;

  return {
    scores: sortedScores,
    percentages,
    topThree,
    topTwoCode,
    personaName,
  };
}

/**
 * Mendapatkan rekomendasi teratas berdasarkan 3 tipe dominan pengguna.
 * Logika ini lebih transparan daripada Cosine Similarity.
 * @param userProfile - Profil pengguna yang sudah diproses.
 * @param items - Array data jurusan atau karier.
 * @returns {MatchResult[]} - Daftar item yang direkomendasikan.
 */
export function getTopMatches(userProfile: UserProfile, items: (Major | Career)[]): MatchResult[] {
  const { topThree } = userProfile;
  
  if (topThree.length === 0) {
    return [];
  }

  // 1. Kelompokkan semua item (jurusan/karier) berdasarkan tipe dominan mereka.
  const itemsByDominantType = items.reduce((acc, item) => {
    // Cari tipe dengan skor tertinggi di profil item
    const dominantType = Object.entries(item.riasecProfile).sort(([,a],[,b]) => b - a)[0][0] as RiasecType;
    
    if (!acc[dominantType]) {
      acc[dominantType] = [];
    }
    acc[dominantType].push(item);
    return acc;
  }, {} as { [key in RiasecType]?: (Major | Career)[] });

  // 2. Kumpulkan rekomendasi berdasarkan 3 tipe teratas pengguna
  const recommendations: MatchResult[] = [];
  
  // Ambil 3 rekomendasi untuk tipe dominan #1
  const firstType = topThree[0];
  if (itemsByDominantType[firstType]) {
    itemsByDominantType[firstType].slice(0, 3).forEach(item => {
      recommendations.push({
        id: item.id,
        name: item.name,
        description: item.description,
        matchedType: firstType, // Tandai kenapa ini direkomendasikan
        riasecProfile: item.riasecProfile
      });
    });
  }

  // Ambil 2 rekomendasi untuk tipe dominan #2
  const secondType = topThree[1];
  if (itemsByDominantType[secondType]) {
    itemsByDominantType[secondType].slice(0, 2).forEach(item => {
      // Pastikan tidak ada duplikat
      if (!recommendations.some(rec => rec.id === item.id)) {
        recommendations.push({
          id: item.id,
          name: item.name,
          description: item.description,
          matchedType: secondType,
          riasecProfile: item.riasecProfile
        });
      }
    });
  }

  // Ambil 1 rekomendasi untuk tipe dominan #3
  const thirdType = topThree[2];
  if (itemsByDominantType[thirdType]) {
    itemsByDominantType[thirdType].slice(0, 1).forEach(item => {
      // Pastikan tidak ada duplikat
      if (!recommendations.some(rec => rec.id === item.id)) {
        recommendations.push({
          id: item.id,
          name: item.name,
          description: item.description,
          matchedType: thirdType,
          riasecProfile: item.riasecProfile
        });
      }
    });
  }
  
  // Kita batasi total rekomendasi agar tidak terlalu banyak, misal 6
  return recommendations.slice(0, 6);
}

export function getPersonalizedMotivation(topTwoCode: string): string {
  const reversedCode = topTwoCode.split('').reverse().join('');
  return motivations[topTwoCode] || motivations[reversedCode] || motivations['DEFAULT'];
}