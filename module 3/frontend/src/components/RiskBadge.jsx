import React from 'react';

export default function RiskBadge({ category, svi }) {
  let badgeStyle = "bg-slate-100 text-slate-800 border-slate-300";

  switch (category) {
    case 'Critical':
      badgeStyle = "bg-red-100 text-red-800 border-red-300 font-bold";
      break;
    case 'High':
      badgeStyle = "bg-orange-100 text-orange-800 border-orange-300 font-semibold";
      break;
    case 'Moderate':
      badgeStyle = "bg-amber-100 text-amber-800 border-amber-300";
      break;
    case 'Low':
      badgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-300";
      break;
    default:
      badgeStyle = "bg-slate-100 text-slate-700 border-slate-300";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${badgeStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {category} {svi !== undefined && <span className="opacity-75">({svi})</span>}
    </span>
  );
}
