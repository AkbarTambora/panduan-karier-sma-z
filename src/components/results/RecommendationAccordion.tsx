// src/components/results/RecommendationAccordion.tsx
"use client";

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import type { MatchResult } from '@/lib/services/riasecService';
import { RecommendationCard } from './RecommendationCard';

interface RiasecColorMap {
  [key: string]: {
    bg: string;
    text: string;
    bgLight: string;
  };
}

interface AccordionProps {
  subtitle: string;
  itemCount: number;
  items: MatchResult[];
  defaultOpen?: boolean;
  icon: React.ReactNode;
  riasecColors: RiasecColorMap;
}

export function RecommendationAccordion({
  subtitle,
  itemCount,
  items,
  defaultOpen = false,
  icon,
  riasecColors
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{subtitle}</h3>
              <p className="text-sm text-slate-500">{itemCount} rekomendasi cocok untukmu</p>
            </div>
          </div>
          <div className="text-slate-400">
            {isOpen ? <ChevronUpIcon className="h-6 w-6" /> : <ChevronDownIcon className="h-6 w-6" />}
          </div>
        </div>
      </button>
      
      {/* Accordion Content */}
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-6 pb-6 space-y-4">
          {items.map((item) => (
            <RecommendationCard
              key={item.id}
              item={item}
              riasecColors={riasecColors}
            />
          ))}
        </div>
      </div>
    </div>
  );
}