import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity } from 'lucide-react';

export default function EmotionChart({ emotionScores }) {
  const { fear = 0, anxiety = 0, sadness = 0, anger = 0, distress = 0 } = emotionScores || {};

  const chartData = [
    { emotion: 'Fear', score: fear, fill: '#ef4444' },
    { emotion: 'Anxiety', score: anxiety, fill: '#f97316' },
    { emotion: 'Sadness', score: sadness, fill: '#3b82f6' },
    { emotion: 'Anger', score: anger, fill: '#d97706' },
    { emotion: 'Distress', score: distress, fill: '#dc2626' },
  ];

  const radarData = [
    { subject: 'Fear', A: fear },
    { subject: 'Anxiety', A: anxiety },
    { subject: 'Sadness', A: sadness },
    { subject: 'Anger', A: anger },
    { subject: 'Distress', A: distress },
  ];

  const getSeverityBadge = (score) => {
    if (score >= 75) return <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2.5 py-0.5 rounded-full border border-rose-200">Severe</span>;
    if (score >= 50) return <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">Moderate</span>;
    if (score >= 25) return <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">Mild</span>;
    return <span className="text-[10px] bg-stone-100 text-stone-600 font-medium px-2.5 py-0.5 rounded-full">Low</span>;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm warm-card-hover space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <h3 className="text-sm font-bold text-slate-800 flex items-center">
          <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg mr-2">
            <Activity className="w-4 h-4" />
          </div>
          <span>Psychological Emotion & Distress Breakdown</span>
        </h3>
        <span className="text-xs text-slate-500 font-mono font-medium">Scores: 0 - 100%</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { key: 'fear', label: 'Fear', val: fear, color: 'bg-rose-500', bg: 'bg-rose-50/70 border-rose-100' },
          { key: 'anxiety', label: 'Anxiety', val: anxiety, color: 'bg-amber-500', bg: 'bg-amber-50/70 border-amber-100' },
          { key: 'sadness', label: 'Sadness', val: sadness, color: 'bg-blue-500', bg: 'bg-blue-50/70 border-blue-100' },
          { key: 'anger', label: 'Anger', val: anger, color: 'bg-orange-500', bg: 'bg-orange-50/70 border-orange-100' },
          { key: 'distress', label: 'Distress', val: distress, color: 'bg-red-600', bg: 'bg-red-50/70 border-red-100' },
        ].map((item) => (
          <div key={item.key} className={`bg-stone-50/80 border border-stone-200/70 rounded-xl p-3.5 space-y-2`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 capitalize">{item.label}</span>
              <span className="text-sm font-extrabold font-mono text-slate-900">{item.val}%</span>
            </div>

            <div className="w-full h-2.5 bg-stone-200/80 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} transition-all duration-500 rounded-full`}
                style={{ width: `${Math.min(100, Math.max(0, item.val))}%` }}
              ></div>
            </div>

            <div className="pt-1 flex justify-end">
              {getSeverityBadge(item.val)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        <div className="bg-stone-50/70 border border-stone-200/80 rounded-xl p-4">
          <div className="text-xs font-bold text-slate-700 mb-3 text-center">
            Emotion Severity Distribution (Bar)
          </div>
          <div className="h-48 w-full min-h-[192px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={180}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="emotion" stroke="#64748b" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }}
                  itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-stone-50/70 border border-stone-200/80 rounded-xl p-4">
          <div className="text-xs font-bold text-slate-700 mb-3 text-center">
            Distress Profile Radar (Multidimensional)
          </div>
          <div className="h-48 w-full min-h-[192px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={180}>
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis dataKey="subject" stroke="#475569" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
                <Radar name="Distress Level" dataKey="A" stroke="#d97706" fill="#d97706" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
