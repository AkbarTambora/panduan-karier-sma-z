// Lokasi file: src/components/results/HexagonChart.tsx

"use client";

import type { RiasecType } from "@/data/riasecQuestions";

type RiasecColorMap = {
  [key in RiasecType]: { bg: string; text: string; bgLight: string };
};

type HexagonChartProps = {
  percentages: [RiasecType, number][];
  topThree: RiasecType[];
  colors: RiasecColorMap;
};

const getOriginalPoint = (index: number, radius: number, value: number) => {
  const angleDeg = 60 * index - 90;
  const angleRad = (Math.PI / 180) * angleDeg;
  const pointRadius = (value / 100) * radius;
  const x = pointRadius * Math.cos(angleRad);
  const y = pointRadius * Math.sin(angleRad);
  return { x, y };
};

function tailwindColorToHex(tailwindClass: string): string {
  const colorMap: Record<string, string> = {
    'orange-500': '#F97316', 'blue-500': '#3B82F6',
    'purple-500': '#8B5CF6', 'green-500': '#22C55E',
    'red-500': '#EF4444', 'slate-500': '#64748B',
  };
  const colorName = tailwindClass.replace('bg-', '');
  return colorMap[colorName] || '#64748B';
}

export function HexagonChart({ percentages, topThree, colors }: HexagonChartProps) {
  const chartSize = 280;
  const padding = 40;
  const svgSize = chartSize + padding * 2;
  const radius = chartSize / 2;
  const center = svgSize / 2;
  const typesOrder: RiasecType[] = ['R', 'I', 'A', 'S', 'E', 'C'];
  const percentageMap = new Map(percentages);
  
  const getPointWithOffset = (index: number, value: number) => {
    const { x, y } = getOriginalPoint(index, radius, value);
    return { x: center + x, y: center + y };
  };
  
  // ==========================================================
  // REVISI: Buat array titik untuk digambar satu per satu
  // ==========================================================
  const dataPoints = typesOrder.map((type, index) => ({
    ...getPointWithOffset(index, percentageMap.get(type) || 0),
    type: type,
  }));
  
  const dataPointsString = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${svgSize} ${svgSize}`} className="max-w-[320px] mx-auto">
      <g>
        {/* 1. Render grid background (tidak berubah) */}
        {[25, 50, 75, 100].map(val => {
          const points = typesOrder.map((_, i) => { const { x, y } = getPointWithOffset(i, val); return `${x},${y}`; }).join(' ');
          return <polygon key={`grid-${val}`} points={points} className="fill-none stroke-slate-200" strokeWidth="1" />;
        })}
        {typesOrder.map((_, i) => {
          const { x: x2, y: y2 } = getPointWithOffset(i, 100);
          return <line key={`line-${i}`} x1={center} y1={center} x2={x2} y2={y2} className="stroke-slate-200" strokeWidth="1" />;
        })}

        {/* 2. Render AREA poligon dengan warna biru transparan netral */}
        <polygon
          points={dataPointsString}
          className="fill-blue-500/20" // <-- Dibuat lebih transparan
        />

        {/* 3. Render GARIS poligon dengan gradasi (dengan menggambar setiap segmen) */}
        {dataPoints.map((point, index) => {
          const nextPoint = dataPoints[(index + 1) % dataPoints.length];
          const gradientId = `line-gradient-${point.type}`;
          
          return (
            <defs key={gradientId}>
              <linearGradient id={gradientId} x1={point.x} y1={point.y} x2={nextPoint.x} y2={nextPoint.y} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={tailwindColorToHex(colors[point.type].bg)} />
                <stop offset="100%" stopColor={tailwindColorToHex(colors[nextPoint.type].bg)} />
              </linearGradient>
            </defs>
          );
        })}
        {dataPoints.map((point, index) => {
            const nextPoint = dataPoints[(index + 1) % dataPoints.length];
            return (
                <line 
                    key={`line-segment-${point.type}`}
                    x1={point.x} y1={point.y}
                    x2={nextPoint.x} y2={nextPoint.y}
                    stroke={`url(#line-gradient-${point.type})`}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            );
        })}


        {/* 4. Render TITIK berwarna di setiap sudut */}
        {dataPoints.map(point => (
          <circle
            key={`dot-${point.type}`}
            cx={point.x}
            cy={point.y}
            r="5" // Radius titik
            fill={tailwindColorToHex(colors[point.type].bg)}
            className="stroke-white"
            strokeWidth="2"
          />
        ))}

        {/* 5. Render label teks dengan warna-warni (tidak berubah) */}
        {typesOrder.map((type, index) => {
          const { x, y } = getPointWithOffset(index, 118);
          const isTopThree = topThree.includes(type);
          const textColorClass = colors[type].text;
          return (
            <text key={`label-${type}`} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className={`text-base ${isTopThree ? 'font-bold' : 'font-medium'} ${textColorClass}`}>
              {type}
            </text>
          );
        })}
      </g>
    </svg>
  );
}