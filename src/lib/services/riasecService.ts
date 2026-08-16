// src/lib/services/riasecService.ts

import type { RiasecType } from '@/data/riasecQuestions';
import type { Career } from '@/data/careers';
import type { Major, RiasecScoreProfile } from '@/data/majors';
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

// 🆕 ENHANCED: MatchResult now includes confidence scoring
export interface MatchResult {
  id: string;
  name: string;
  description: string;
  matchedType: RiasecType;
  riasecProfile: RiasecScoreProfile;
  matchScore: number;
  confidenceScore: number; // 🆕 NEW: 0-100%
  reasoning: string;        // 🆕 NEW: Explanation why it matches
}

// 🆕 NEW: Enhanced grouped recommendations with confidence-based sorting
export interface GroupedRecommendations {
  [category: string]: MatchResult[];
}

// 🆕 NEW: Curated display structure
export interface CuratedRecommendations {
  topPicks: GroupedRecommendations;      // Top 3 categories, 1 item each
  alternatives: GroupedRecommendations;  // Remaining categories
  totalCount: number;
}

export interface AnalysisReport {
  userProfile: UserProfile;
  majorMatches: CuratedRecommendations;  // 🔄 Changed to curated structure
  careerMatches: CuratedRecommendations; // 🔄 Changed to curated structure
  motivation: string;
}

// --- Enum nilai, BUKAN tipe. Kita akan gunakan untuk validasi dan iterasi ---
const RIASEC_TYPES: RiasecType[] = ['R', 'I', 'A', 'S', 'E', 'C'];

/**
 * Fungsi utama yang dipanggil oleh halaman Hasil.
 */
export async function getAnalysisReport(rawScores: { [key: string]: string }): Promise<AnalysisReport> {
  const mongoClient = await clientPromise;
  const dbName = process.env.MONGODB_DB_NAME || "panduan-karier-db";
  
  const db = mongoClient.db(dbName);

  const [majorsData, careersData] = await Promise.all([
    db.collection<Major>('majors').find({}).toArray(),
    db.collection<Career>('careers').find({}).toArray()
  ]);

  const userProfile = processUserScores(rawScores);
  
  // 🔄 Updated calls with curated structure
  const majorMatches = getCuratedMatches(userProfile, majorsData);
  const careerMatches = getCuratedMatches(userProfile, careersData);
  const motivation = getPersonalizedMotivation(userProfile.topTwoCode);

  return {
    userProfile,
    majorMatches,
    careerMatches,
    motivation,
  };
}

/**
 * Process raw scores into user profile
 */
export function processUserScores(rawScores: { [key: string]: string }): UserProfile {
  const scoresMap: Partial<{ [key in RiasecType]: number }> = {};
  
  // ✅ Loop dengan validasi NaN — cegah nilai non-numerik dari URL params
  for (const key in rawScores) {
    if (RIASEC_TYPES.includes(key as RiasecType)) {
      const parsed = Number(rawScores[key]);
      if (!isNaN(parsed)) {
        scoresMap[key as RiasecType] = parsed;
      }
    }
  }

  const sortedScores: RiasecScoreTuple[] = (Object.entries(scoresMap) as RiasecScoreTuple[])
    .sort(([, a], [, b]) => b - a);

  const minScorePerType = 15;
  const maxScorePerType = 75;
  
  const percentages: RiasecScoreTuple[] = sortedScores.map(([type, score]) => {
    // ✅ Clamp normalisasi agar tidak menghasilkan nilai negatif atau > 100
    const normalizedScore = Math.max(0, Math.min(100,
      ((score - minScorePerType) / (maxScorePerType - minScorePerType)) * 100
    ));
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
    };
  }

  const dominantTypeInfo = riasecDetails[topThree[0]];
  const secondaryTypeInfo = riasecDetails[topThree[1]];
  
  // ✅ FIXED: Extract nama Indonesia dari dalam kurung, misal "Si Realistis" dari "Realistic (Si Realistis)"
  const extractIndonesianName = (fullName: string): string => {
    const match = fullName.match(/\(Si ([^)]+)\)/);
    return match ? match[1] : fullName.split(' (')[0];
  };
  const dominantPersona = extractIndonesianName(dominantTypeInfo.name); // "Realistis"
  const secondaryPersona = extractIndonesianName(secondaryTypeInfo.name); // "Kreatif"
  const personaName = `Si ${dominantPersona} yang ${secondaryPersona}`;

  return {
    scores: sortedScores,
    percentages,
    topThree,
    topTwoCode,
    personaName,
  };
}

/**
 * 🆕 NEW: Enhanced getCuratedMatches function with confidence scoring and curated display
 */
export function getCuratedMatches(
  userProfile: UserProfile,
  items: (Major | Career)[]
): CuratedRecommendations {
  
  // 1. Calculate match scores with confidence for ALL items
  const allMatches: (MatchResult & { category: string })[] = [];
  
  for (const item of items) {
    const { matchScore, confidenceScore, reasoning } = calculateEnhancedMatchScore(userProfile, item);
    const dominantType = getDominantType(item.riasecProfile);
    
    if (userProfile.topThree.includes(dominantType)) {
      allMatches.push({
        id: item.id,
        name: item.name,
        description: item.description,
        matchedType: dominantType,
        riasecProfile: item.riasecProfile,
        matchScore: matchScore,
        confidenceScore: confidenceScore, // 🆕 NEW
        reasoning: reasoning,             // 🆕 NEW
        // 🆕 Add category for grouping
        category: 'subField' in item ? item.subField : item.subCluster
      });
    }
  }
  
  // 2. Sort by confidence score first, then match score
  allMatches.sort((a, b) => {
    if (Math.abs(a.confidenceScore - b.confidenceScore) > 5) {
      return b.confidenceScore - a.confidenceScore;
    }
    return b.matchScore - a.matchScore;
  });
  
  // 3. Group by category
  const grouped: GroupedRecommendations = {};
  
  for (const match of allMatches) {
    const category = match.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    
    // Limit items per category
    if (grouped[category].length < 4) {
      // ✅ Remove category field before pushing to grouped result
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { category: categoryField, ...matchWithoutCategory } = match;
      grouped[category].push(matchWithoutCategory);
    }
  }
  
  // 4. 🆕 NEW: Create curated structure
  const sortedCategories = Object.entries(grouped)
    .map(([category, items]) => ({
      category,
      items,
      avgConfidence: items.reduce((sum, item) => sum + item.confidenceScore, 0) / items.length,
      avgMatch: items.reduce((sum, item) => sum + item.matchScore, 0) / items.length
    }))
    .sort((a, b) => {
      // Sort by confidence first, then match score
      if (Math.abs(a.avgConfidence - b.avgConfidence) > 5) {
        return b.avgConfidence - a.avgConfidence;
      }
      return b.avgMatch - a.avgMatch;
    });
  
  // 5. 🆕 NEW: Split into topPicks and alternatives
  const topPicks: GroupedRecommendations = {};
  const alternatives: GroupedRecommendations = {};
  
  sortedCategories.forEach(({ category, items }, index) => {
    if (index < 3) {
      // Top 3 categories go to topPicks with only 1 item each
      topPicks[category] = [items[0]];
    } else {
      // Rest go to alternatives
      alternatives[category] = items;
    }
  });
  
  return {
    topPicks,
    alternatives,
    totalCount: allMatches.length
  };
}

/**
 * 🆕 NEW: Enhanced match calculation with confidence scoring
 */
function calculateEnhancedMatchScore(
  userProfile: UserProfile, 
  item: Major | Career
): { matchScore: number; confidenceScore: number; reasoning: string } {
  
  const userPercentagesMap = new Map(userProfile.percentages);
  
  // Calculate basic match score (existing logic)
  let sad = 0;
  for (const type of RIASEC_TYPES) {
    const userScore = userPercentagesMap.get(type) || 0;
    const itemScore = (item.riasecProfile[type] || 0) * 10; // Scale 1-10 to 0-100
    sad += Math.abs(userScore - itemScore);
  }

  const maxSAD = 600;
  const matchScore = (1 - (sad / maxSAD)) * 100;

  // 🆕 NEW: Calculate confidence score
  const dominantType = getDominantType(item.riasecProfile);
  const userTopThree = userProfile.topThree;
  
  let confidenceScore = 50; // Base confidence
  let reasoning = "";
  
  // Boost confidence if item's dominant type is in user's top 3
  if (userTopThree.includes(dominantType)) {
    const typeIndex = userTopThree.indexOf(dominantType);
    if (typeIndex === 0) {
      confidenceScore += 40; // Primary match
      reasoning = `Perfect match dengan tipe dominanmu (${riasecDetails[dominantType].name.split(' (')[0]})`;
    } else if (typeIndex === 1) {
      confidenceScore += 30; // Secondary match
      reasoning = `Strong match dengan tipe sekundermu (${riasecDetails[dominantType].name.split(' (')[0]})`;
    } else {
      confidenceScore += 20; // Tertiary match
      reasoning = `Good match dengan salah satu tipe topmu (${riasecDetails[dominantType].name.split(' (')[0]})`;
    }
  }
  
  // Boost confidence for high match scores
  if (matchScore > 80) {
    confidenceScore += 10;
    reasoning += ` + Skor kecocokan sangat tinggi`;
  }
  
  // Reduce confidence for low match scores
  if (matchScore < 60) {
    confidenceScore -= 15;
    reasoning += ` (perlu pertimbangan lebih)`;
  }
  
  // Ensure confidence score is within bounds
  confidenceScore = Math.max(10, Math.min(95, confidenceScore));
  
  if (!reasoning) {
    reasoning = `Kecocokan berdasarkan analisis profil RIASEC`;
  }

  return {
    matchScore: Math.round(matchScore),
    confidenceScore: Math.round(confidenceScore),
    reasoning: reasoning
  };
}

/**
 * Get personalized motivation message
 */
export function getPersonalizedMotivation(topTwoCode: string): string {
  const reversedCode = topTwoCode.split('').reverse().join('');
  return motivations[topTwoCode] || motivations[reversedCode] || motivations['DEFAULT'];
}

/**
 * Helper function to get dominant RIASEC type from profile
 */
function getDominantType(riasecProfile: RiasecScoreProfile): RiasecType {
  return Object.entries(riasecProfile)
    .sort(([, a], [, b]) => b - a)[0][0] as RiasecType;
}