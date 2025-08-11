// src/components/results/GroupedRecommendations.tsx

"use client";

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, TrophyIcon, EyeIcon } from 'lucide-react';
import { RecommendationAccordion } from './RecommendationAccordion';
import type { CuratedRecommendations, MatchResult } from '@/lib/services/riasecService';

interface RiasecColorMap {
  [key: string]: {
    bg: string;
    text: string;
    bgLight: string;
  };
}

interface GroupedRecommendationsProps {
  title: string;
  curatedItems: CuratedRecommendations; // 🔄 Changed from GroupedRecommendations
  icon: React.ReactNode;
  riasecColors: RiasecColorMap;
}

// 🆕 NEW: TopPickCard component for prominent display
function TopPickCard({ 
  category, 
  items, 
  icon, 
  riasecColors 
}: { 
  category: string; 
  items: MatchResult[]; // ✅ Fixed: Use proper type instead of any[]
  icon: React.ReactNode;
  riasecColors: RiasecColorMap;
}) {
  const item = items[0]; // Only show first item in top picks
  const colorClass = riasecColors[item.matchedType];
  
  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border-2 border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-white/80 p-2 rounded-lg text-blue-600">
            {icon}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-lg">{item.name}</h4>
            <p className="text-sm text-slate-600">{category}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xs font-bold px-3 py-1 rounded-full ${colorClass.bgLight} ${colorClass.text} mb-2`}>
            {item.confidenceScore}% Confident
          </div>
          <div className="text-xs text-slate-500">
            {item.matchScore}% Match
          </div>
        </div>
      </div>
      
      <p className="text-slate-700 text-sm mb-4 leading-relaxed line-clamp-2">
        {item.description}
      </p>
      
      <div className="bg-slate-50 p-3 rounded-lg">
        <p className="text-xs text-slate-600 font-medium">
          💡 {item.reasoning}
        </p>
      </div>
    </div>
  );
}

export function GroupedRecommendations({
  title,
  curatedItems,
  icon,
  riasecColors
}: GroupedRecommendationsProps) {
  
  const [showAlternatives, setShowAlternatives] = useState(false);
  
  const { topPicks, alternatives, totalCount } = curatedItems;
  const topPickCategories = Object.entries(topPicks);
  const alternativeCategories = Object.entries(alternatives);
  
  if (topPickCategories.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
            {icon}
          </div>
          <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
        </div>
        <div className="bg-slate-100 p-8 rounded-2xl text-center">
          <p className="text-slate-500">Tidak ada rekomendasi yang ditemukan.</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center space-x-3">
        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
          {icon}
        </div>
        <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
      </div>
      
      {/* 🏆 TOP PICKS SECTION - Always Visible & Prominent */}
      <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 p-1 rounded-2xl">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-lg">
              <TrophyIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">🏆 TOP PICKS FOR YOU</h3>
              <p className="text-sm text-slate-600">Rekomendasi dengan confidence score tertinggi</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topPickCategories.map(([category, items]) => (
              <TopPickCard
                key={category}
                category={category}
                items={items}
                icon={icon}
                riasecColors={riasecColors}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* 🔍 MORE OPTIONS SECTION - Collapsible */}
      {alternativeCategories.length > 0 && (
        <div className="space-y-4">
          <button
            onClick={() => setShowAlternatives(!showAlternatives)}
            className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-slate-100 p-2 rounded-lg">
                <EyeIcon className="h-5 w-5 text-slate-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-slate-800">
                  Jelajahi Lebih Banyak Pilihan
                </h4>
                <p className="text-sm text-slate-500">
                  {alternativeCategories.length} kategori lainnya • {totalCount - topPickCategories.reduce((sum, [, items]) => sum + items.length, 0)} opsi tambahan
                </p>
              </div>
            </div>
            <div className="text-slate-400">
              {showAlternatives ? 
                <ChevronUpIcon className="h-6 w-6" /> : 
                <ChevronDownIcon className="h-6 w-6" />
              }
            </div>
          </button>
          
          {/* Alternatives Content - Animated Collapse */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showAlternatives ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="space-y-4 pt-2">
              {alternativeCategories.map(([category, items], index) => (
                <RecommendationAccordion
                  key={category}
                  subtitle={category}
                  itemCount={items.length}
                  items={items}
                  defaultOpen={index === 0} // Only first alternative category open by default
                  icon={icon}
                  riasecColors={riasecColors}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* 📊 Quick Stats */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            <strong className="text-slate-800">{totalCount}</strong> total rekomendasi dianalisis
          </span>
          <span>
            <strong className="text-blue-600">{topPickCategories.length}</strong> top picks dipilih untukmu
          </span>
        </div>
      </div>
    </section>
  );
}