// src/components/results/RecommendationCard.tsx

import type { MatchResult } from '@/lib/services/riasecService';
import { riasecDetails } from '@/data/riasecDescriptions';
import { CheckCircleIcon, InfoIcon } from 'lucide-react';

interface RecommendationCardProps {
  item: MatchResult;
  riasecColors: {
    [key: string]: {
      bg: string;
      text: string;
      bgLight: string;
    };
  };
}

export function RecommendationCard({ item, riasecColors }: RecommendationCardProps) {
  const colorClass = riasecColors[item.matchedType];
  
  // 🆕 NEW: Determine confidence level for styling
  const getConfidenceLevel = (score: number) => {
    if (score >= 80) return { label: 'Sangat Yakin', color: 'bg-green-500', textColor: 'text-green-800', bgLight: 'bg-green-50' };
    if (score >= 70) return { label: 'Yakin', color: 'bg-blue-500', textColor: 'text-blue-800', bgLight: 'bg-blue-50' };
    if (score >= 60) return { label: 'Cukup Yakin', color: 'bg-yellow-500', textColor: 'text-yellow-800', bgLight: 'bg-yellow-50' };
    return { label: 'Pertimbangkan', color: 'bg-gray-500', textColor: 'text-gray-800', bgLight: 'bg-gray-50' };
  };
  
  const confidenceLevel = getConfidenceLevel(item.confidenceScore);
  
  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h4 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h4>
          <div className="flex flex-wrap gap-2">
            <span 
              className={`text-xs font-bold px-3 py-1 rounded-full ${colorClass.bgLight} ${colorClass.text}`}
            >
              Sesuai Minat {riasecDetails[item.matchedType].name.replace(/\s\(.*\)/, '')}
            </span>
            
            {/* 🆕 NEW: Confidence Badge */}
            <span 
              className={`text-xs font-bold px-3 py-1 rounded-full ${confidenceLevel.bgLight} ${confidenceLevel.textColor}`}
            >
              {confidenceLevel.label} ({item.confidenceScore}%)
            </span>
          </div>
        </div>
        
        {/* 🆕 NEW: Confidence Icon Indicator */}
        <div className="flex items-center ml-4">
          {item.confidenceScore >= 80 ? (
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
          ) : (
            <InfoIcon className="h-6 w-6 text-blue-500" />
          )}
        </div>
      </div>
      
      <p className="text-slate-600 text-sm mb-4 leading-relaxed">
        {item.description}
      </p>
      
      {/* 🆕 NEW: Reasoning Section */}
      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
        <div className="flex items-start space-x-2">
          <InfoIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">Mengapa ini cocok untukmu:</p>
            <p className="text-xs text-blue-800">{item.reasoning}</p>
          </div>
        </div>
      </div>
      
      {/* 🔄 ENHANCED: Match Score Meter with Confidence */}
      <div className="space-y-3">
        {/* Match Score */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-600">Tingkat Kecocokan</span>
            <span className={`text-sm font-bold ${colorClass.text}`}>
              {item.matchScore}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${colorClass.bg}`}
              style={{ width: `${item.matchScore}%` }}
            ></div>
          </div>
        </div>
        
        {/* 🆕 NEW: Confidence Score */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-600">Confidence Level</span>
            <span className={`text-sm font-bold ${confidenceLevel.textColor}`}>
              {item.confidenceScore}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${confidenceLevel.color}`}
              style={{ width: `${item.confidenceScore}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* 🔄 ENHANCED: RIASEC Profile Preview with better formatting */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-400 mb-2">Profil RIASEC Detail:</p>
        <div className="flex flex-wrap gap-1">
          {Object.entries(item.riasecProfile)
            .sort(([,a], [,b]) => b - a)
            .map(([type, score]) => (
              <span 
                key={type}
                className={`text-xs px-2 py-1 rounded ${
                  score >= 7 ? 'bg-blue-100 text-blue-800' : 
                  score >= 5 ? 'bg-slate-100 text-slate-700' : 
                  'bg-slate-50 text-slate-500'
                }`}
              >
                {type}:{score}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}