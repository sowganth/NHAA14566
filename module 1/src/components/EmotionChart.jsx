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
    { emotion: 'Distress', score: distress, fill: '#b91c1c' },
  ];

  const radarData = [
    { subject: 'Fear', A: fear },
    { subject: 'Anxiety', A: anxiety },
    { subject: 'Sadness', A: sadness },
    { subject: 'Anger', A: anger },
    { subject: 'Distress', A: distress },
  ];

  const getSeverityBadge = (score) => {
    if (score >= 75) return <span className="text-[10px] bg-red-950 text-red-300 font-bold px-2 py-0.5 rounded border border-red-800">Severe (High Risk)</span>;
    if (score >= 50) return <span className="text-[10px] bg-amber-950 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-800">Moderate</span>;
    if (score >= 25) return <span className="text-[10px] bg-blue-950 text-blue-300 font-medium px-2 py-0.5 rounded border border-blue-800">Mild</span>;
    return <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Low</span>;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center">
          <Activity className="w-4 h-4 mr-2 text-blue-400" />
          <span>Psychological Emotion & Distress Breakdown</span>
        </h3>
        <span className="text-xs text-slate-400 font-mono">Scores: 0 - 100%</span>
      </div>

      {/* Grid of Emotion Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { key: 'fear', label: 'Fear', val: fear, color: 'bg-red-500', border: 'border-red-800/50' },
          { key: 'anxiety', label: 'Anxiety', val: anxiety, color: 'bg-orange-500', border: 'border-orange-800/50' },
          { key: 'sadness', label: 'Sadness', val: sadness, color: 'bg-blue-500', border: 'border-blue-800/50' },
          { key: 'anger', label: 'Anger', val: anger, color: 'bg-amber-500', border: 'border-amber-800/50' },
          { key: 'distress', label: 'Distress', val: distress, color: 'bg-rose-600', border: 'border-rose-800/50' },
        ].map((item) => (
          <div key={item.key} className={`bg-slate-950 border ${item.border} rounded-lg p-3.5 space-y-2`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 capitalize">{item.label}</span>
              <span className="text-sm font-bold font-mono text-white">{item.val}%</span>
            </div>

            {/* Custom Progress Bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
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

      {/* Dual Recharts Visualization (Bar + Radar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Bar Chart */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-300 mb-3 text-center">
            Emotion Severity Distribution (Bar)
          </div>
          <div className="h-48 w-full min-h-[192px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={180}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="emotion" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-300 mb-3 text-center">
            Distress Profile Radar (Multidimensional)
          </div>
          <div className="h-48 w-full min-h-[192px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={180}>
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Distress Level" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
