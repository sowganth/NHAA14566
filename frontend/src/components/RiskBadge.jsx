import React from 'react';

export default function RiskBadge({ category, svi }) {
  let badgeStyle = "bg-stone-100 text-stone-700 border-stone-200 font-semibold";

  const cat = String(category).toUpperCase();
  if (cat === 'CRITICAL') {
    badgeStyle = "bg-rose-100 text-rose-900 border-rose-300 font-extrabold shadow-sm";
  } else if (cat === 'HIGH') {
    badgeStyle = "bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-sm";
  } else if (cat === 'MODERATE') {
    badgeStyle = "bg-amber-50 text-amber-800 border-amber-200 font-bold";
  } else if (cat === 'LOW') {
    badgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${badgeStyle}`}>
      <span className="w-2 h-2 rounded-full bg-current"></span>
      {category} {svi !== undefined && <span className="opacity-90 font-mono">({svi})</span>}
    </span>
  );
}
