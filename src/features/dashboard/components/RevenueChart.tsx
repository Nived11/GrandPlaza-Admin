'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  LineChart, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { TimelinePoint } from '../types/dashboardTypes';

interface RevenueChartProps {
  timeline: TimelinePoint[];
  periodLabel: string;
}

export default function RevenueChart({ timeline, periodLabel }: RevenueChartProps) {
  const [viewMode, setViewMode] = useState<'revenue' | 'orders'>('revenue');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-center justify-center h-64 text-gray-400 text-sm">
        No sales data recorded for {periodLabel}.
      </div>
    );
  }

  // Values based on viewMode
  const values = timeline.map((p) => (viewMode === 'revenue' ? p.revenue : p.orders));
  const maxValue = Math.max(...values, viewMode === 'revenue' ? 100 : 5);
  const totalValue = values.reduce((a, b) => a + b, 0);

  // Peak interval
  let peakIndex = 0;
  values.forEach((v, i) => {
    if (v > values[peakIndex]) peakIndex = i;
  });
  const peakPoint = timeline[peakIndex];

  // SVG dimensions
  const svgWidth = 700;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // Calculate coordinates for SVG line/area
  const points = values.map((val, idx) => {
    const x = paddingX + (idx / Math.max(1, values.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - (val / maxValue) * chartHeight;
    return { x, y, val, original: timeline[idx] };
  });

  // Create smooth SVG path string
  let pathD = '';
  if (points.length === 1) {
    pathD = `M ${points[0].x} ${points[0].y}`;
  } else if (points.length > 1) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
  }

  // Close area for gradient fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingY + chartHeight} L ${points[0].x} ${paddingY + chartHeight} Z`;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
      
      {/* Top Header of Chart */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Sales Trend & Order Volume
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
              Swiggy Style
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Performance progression over {periodLabel}
          </p>
        </div>

        {/* View Switcher: Revenue vs Orders */}
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-2xl border border-gray-200/80 text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('revenue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
              viewMode === 'revenue'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LineChart size={14} />
            <span>Revenue (₹)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer ${
              viewMode === 'orders'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 size={14} />
            <span>Orders</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Chart Canvas */}
      <div className="relative py-4 select-none">
        
        {/* Tooltip Overlay if hovered */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 bg-slate-900 text-white text-xs py-2 px-3 rounded-2xl shadow-xl border border-slate-700 space-y-0.5 transition-all duration-75"
            style={{
              left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
              top: '5px',
            }}
          >
            <div className="font-bold text-gray-300 text-[11px] border-b border-gray-700 pb-1 mb-1">
              {points[hoveredIndex].original.label}
            </div>
            <div className="flex items-center justify-between gap-3 text-emerald-400 font-black">
              <span>Revenue:</span>
              <span>₹{points[hoveredIndex].original.revenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-orange-400 font-bold">
              <span>Orders:</span>
              <span>{points[hoveredIndex].original.orders} orders</span>
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-48 sm:h-64 overflow-visible"
        >
          <defs>
            {/* Emerald Gradient for Revenue */}
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>

            {/* Orange Gradient for Orders */}
            <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingY + chartHeight * ratio;
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={svgWidth - paddingX}
                y2={y}
                stroke="#F1F5F9"
                strokeWidth="1"
                strokeDasharray={i === 4 ? '0' : '4 4'}
              />
            );
          })}

          {/* Filled Area */}
          <path
            d={areaD}
            fill={viewMode === 'revenue' ? 'url(#revenueGrad)' : 'url(#ordersGrad)'}
          />

          {/* Stroke Line */}
          <path
            d={pathD}
            fill="none"
            stroke={viewMode === 'revenue' ? '#059669' : '#EA580C'}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points with Hover detection */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            const isPeak = idx === peakIndex;
            return (
              <g
                key={idx}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Invisible larger hit area for touch/hover */}
                <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                {/* Visible Circle dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? '7' : isPeak ? '5.5' : '4'}
                  fill={isHovered ? '#0F172A' : viewMode === 'revenue' ? '#059669' : '#EA580C'}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                />

                {/* X-axis Label below point */}
                <text
                  x={pt.x}
                  y={svgHeight - 4}
                  textAnchor="middle"
                  className={`text-[11px] font-bold ${
                    isHovered ? 'fill-slate-900 font-black' : 'fill-gray-400'
                  }`}
                >
                  {pt.original.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Insights Bar */}
      <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        <div className="bg-gray-50 rounded-2xl p-2.5">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">
            {viewMode === 'revenue' ? 'Total Period Sales' : 'Total Orders Placed'}
          </span>
          <span className="text-sm font-black text-slate-900">
            {viewMode === 'revenue'
              ? `₹${totalValue.toLocaleString('en-IN')}`
              : `${totalValue} orders`}
          </span>
        </div>

        <div className="bg-orange-50/60 rounded-2xl p-2.5 border border-orange-100">
          <span className="text-[10px] uppercase font-bold text-orange-700 block">
            Peak Interval
          </span>
          <span className="text-sm font-black text-orange-950 flex items-center gap-1">
            <span>{peakPoint ? peakPoint.label : 'N/A'}</span>
            <span className="text-[11px] font-normal text-orange-800">
              ({peakPoint ? (viewMode === 'revenue' ? `₹${peakPoint.revenue}` : `${peakPoint.orders} ord`) : ''})
            </span>
          </span>
        </div>

        <div className="bg-emerald-50/60 rounded-2xl p-2.5 border border-emerald-100 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">
            Avg / Slot
          </span>
          <span className="text-sm font-black text-emerald-950">
            {viewMode === 'revenue'
              ? `₹${(totalValue / Math.max(1, timeline.length)).toFixed(1)}`
              : `${(totalValue / Math.max(1, timeline.length)).toFixed(1)} ord`}
          </span>
        </div>
      </div>

    </div>
  );
}
