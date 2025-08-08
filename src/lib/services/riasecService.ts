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
  matchScore: number;
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
export function getTopMatches(
  userProfile: UserProfile, 
  items: (Major | Career)[]
): MatchResult[] {
  const { topThree, percentages } = userProfile;
  
  if (topThree.length === 0) {
    return [];
  }

  const allMatches: MatchResult[] = [];

  // 1. Hitung skor kecocokan untuk SEMUA item
  for (const item of items) {
    const matchScore = calculateMatchScore(percentages, item.riasecProfile);
    const dominantType = Object.entries(item.riasecProfile).sort(([,a],[,b]) => b - a)[0][0] as RiasecType;

    // Tambahkan hanya jika tipe dominan item ada di 3 teratas pengguna
    if (topThree.includes(dominantType)) {
      allMatches.push({
        id: item.id,
        name: item.name,
        description: item.description,
        matchedType: dominantType,
        riasecProfile: item.riasecProfile,
        matchScore: matchScore,
      });
    }
  }

  // 2. Urutkan semua kandidat berdasarkan skor kecocokan, dari tertinggi ke terendah
  allMatches.sort((a, b) => b.matchScore - a.matchScore);

  // 3. Ambil 6 rekomendasi teratas, pastikan tidak ada duplikat ID (untuk jaga-jaga)
  const finalRecommendations: MatchResult[] = [];
  const seenIds = new Set<string>();
  
  for (const match of allMatches) {
    if (finalRecommendations.length >= 6) break;
    if (!seenIds.has(match.id)) {
      finalRecommendations.push(match);
      seenIds.add(match.id);
    }
  }
  
  return finalRecommendations;
}

export function getPersonalizedMotivation(topTwoCode: string): string {
  const reversedCode = topTwoCode.split('').reverse().join('');
  return motivations[topTwoCode] || motivations[reversedCode] || motivations['DEFAULT'];
}

/**
 * Menghitung skor kecocokan antara profil pengguna dan profil item (jurusan/karier).
 * Menggunakan metode 1 - (SAD / MaxSAD) untuk menghasilkan persentase (0-100).
 * @param userPercentages - Array persentase pengguna, format: [['R', 75], ['I', 60], ...]
 * @param itemProfile - Objek profil RIASEC item, format: { R: 9, I: 8, ... } (skala 1-10)
 * @returns {number} Skor kecocokan dalam persen (0-100).
 */
function calculateMatchScore(
  userPercentages: RiasecScoreTuple[], 
  itemProfile: RiasecScoreProfile
): number {
  const userPercentagesMap = new Map(userPercentages);
  
  // Sum of Absolute Differences (SAD)
  let sad = 0;
  for (const type of RIASEC_TYPES) {
    const userScore = userPercentagesMap.get(type) || 0;
    const itemScore = (itemProfile[type] || 0) * 10; // Ubah skala 1-10 jadi 0-100
    sad += Math.abs(userScore - itemScore);
  }

  // SAD maksimum yang mungkin terjadi adalah 600 (jika semua 0 vs 100).
  const maxSAD = 600;
  
  // Ubah SAD menjadi skor kecocokan (semakin kecil SAD, semakin tinggi skor)
  const matchScore = (1 - (sad / maxSAD)) * 100;

  return Math.round(matchScore);
}