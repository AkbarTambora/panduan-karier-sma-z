// src/components/results/HexagonChart.tsx
"use client";

import type { RiasecType } from "@/data/riasecQuestions";

type HexagonChartProps = {
  percentages: [RiasecType, number][];
  topThree: RiasecType[];
};

const getOriginalPoint = (index: number, radius: number, value: number) => {
  const angleDeg = 60 * index - 90;
  const angleRad = (Math.PI / 180) * angleDeg;
  const pointRadius = (value / 100) * radius;
  const x = pointRadius * Math.cos(angleRad);
  const y = pointRadius * Math.sin(angleRad);
  return { x, y };
};

export function HexagonChart({ percentages, topThree }: HexagonChartProps) {

  const chartSize = 280; // Ukuran asli chart yang kita inginkan
  const padding = 40; // Ruang ekstra untuk label di setiap sisi
  
  const svgSize = chartSize + padding * 2; // Ukuran total SVG termasuk padding
  const radius = chartSize / 2; // Radius untuk kalkulasi bentuk hexagon
  const center = svgSize / 2; // Titik tengah dari SVG yang sudah dipadding

  const typesOrder: RiasecType[] = ['R', 'I', 'A', 'S', 'E', 'C'];
  
  const percentageMap = new Map(percentages);

  const getPointWithOffset = (index: number, value: number) => {
    const { x, y } = getOriginalPoint(index, radius, value);
    return { x: center + x, y: center + y };
  };

  const dataPointsString = typesOrder
    .map((type, index) => {
      const { x, y } = getPointWithOffset(index, percentageMap.get(type) || 0);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    // Gunakan svgSize untuk viewBox dan dimensi
    <svg width="100%" height="100%" viewBox={`0 0 ${svgSize} ${svgSize}`} className="max-w-[320px] mx-auto">
      <g>
        {/* 1. Render Background Grids and Lines */}
        {[25, 50, 75, 100].map(val => {
          const points = typesOrder.map((_, i) => {
            const { x, y } = getPointWithOffset(i, val);
            return `${x},${y}`;
          }).join(' ');
          return (
            <polygon
              key={`grid-${val}`}
              points={points}
              className="fill-none stroke-slate-200"
              strokeWidth="1"
            />
          );
        })}
        {typesOrder.map((_, i) => {
          const { x: x2, y: y2 } = getPointWithOffset(i, 100);
          return (
            <line
              key={`line-${i}`}
              x1={center} // Mulai dari titik tengah baru
              y1={center} // Mulai dari titik tengah baru
              x2={x2}
              y2={y2}
              className="stroke-slate-200"
              strokeWidth="1"
            />
          );
        })}
        
        {/* 2. Render User Data Polygon */}
        <polygon
          points={dataPointsString}
          className="fill-blue-500/30 stroke-blue-600"
          strokeWidth="2.5"
        />

        {/* 3. Render Text Labels (di-render terakhir agar di atas segalanya) */}
        {typesOrder.map((type, index) => {
          // Tempatkan teks sedikit di luar grid 100%
          const { x, y } = getPointWithOffset(index, 118); 
          const isTopThree = topThree.includes(type);
          return (
            <text
              key={`label-${type}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={`text-base ${isTopThree ? 'font-bold fill-slate-800' : 'font-medium fill-slate-500'}`}
            >
              {type}
            </text>
          );
        })}
      </g>
    </svg>
  );
}