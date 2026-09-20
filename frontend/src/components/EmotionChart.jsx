import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity } from 'lucide-react';

export default function EmotionChart({ emotionScores }) {
  const { fear = 0, anxiety = 0, sadness = 0, anger = 0, distress = 0 } = emotionScores || {};

  const chartData = [
    { emotion: 'Fear', score: fear, fill: '#a78bfa' },
    { emotion: 'Anxiety', score: anxiety, fill: '#c084fc' },
    { emotion: 'Sadness', score: sadness, fill: '#8b5cf6' },
    { emotion: 'Anger', score: anger, fill: '#f472b6' },
    { emotion: 'Distress', score: distress, fill: '#7c3aed' },
  ];

  const radarData = [
    { subject: 'Fear', A: fear },
    { subject: 'Anxiety', A: anxiety },
    { subject: 'Sadness', A: sadness },
    { subject: 'Anger', A: anger },
    { subject: 'Distress', A: distress },
  ];

  const getSeverityBadge = (score) => {
    if (score >= 75) return <span className="text-[10px] bg-rose-500/15 text-rose-200 font-extrabold px-2.5 py-0.5 rounded-full border border-rose-400/30">Severe</span>;
    if (score >= 50) return <span className="text-[10px] bg-violet-500/15 text-violet-200 font-bold px-2.5 py-0.5 rounded-full border border-violet-400/30">Moderate</span>;
    if (score >= 25) return <span className="text-[10px] bg-fuchsia-500/15 text-fuchsia-200 font-bold px-2.5 py-0.5 rounded-full border border-fuchsia-400/30">Mild</span>;
    return <span className="text-[10px] bg-slate-700 text-slate-300 font-medium px-2.5 py-0.5 rounded-full">Low</span>;
  };

  return (
    <div className="bg-slate-900/80 border border-violet-500/20 rounded-2xl p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)] space-y-6">
      <div className="flex items-center justify-between border-b border-violet-500/20 pb-3.5">
        <h3 className="text-sm font-bold text-white flex items-center">
          <div className="p-1.5 bg-violet-500/15 text-violet-200 rounded-lg mr-2 border border-violet-400/30">
            <Activity className="w-4 h-4" />
          </div>
          <span>Psychological Emotion & Distress Breakdown</span>
        </h3>
        <span className="text-xs text-violet-100 font-mono font-medium">Scores: 0 - 100%</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { key: 'fear', label: 'Fear', val: fear, color: 'bg-violet-500' },
          { key: 'anxiety', label: 'Anxiety', val: anxiety, color: 'bg-fuchsia-500' },
          { key: 'sadness', label: 'Sadness', val: sadness, color: 'bg-indigo-500' },
          { key: 'anger', label: 'Anger', val: anger, color: 'bg-pink-500' },
          { key: 'distress', label: 'Distress', val: distress, color: 'bg-purple-600' },
        ].map((item) => (
          <div key={item.key} className="bg-slate-950/60 border border-violet-500/20 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-100 capitalize">{item.label}</span>
              <span className="text-sm font-extrabold font-mono text-white">{item.val}%</span>
            </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        <div className="bg-slate-950/60 border border-violet-500/20 rounded-xl p-4">
          <div className="text-xs font-bold text-violet-100 mb-3 text-center">
            Emotion Severity Distribution (Bar)
          </div>
          <div className="h-48 w-full min-h-[192px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={180}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="emotion" stroke="#c4b5fd" tick={{ fontSize: 11, fill: '#ddd6fe' }} />
                <YAxis domain={[0, 100]} stroke="#c4b5fd" tick={{ fontSize: 11, fill: '#ddd6fe' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#7c3aed', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} fill="#a78bfa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-violet-500/20 rounded-xl p-4">
          <div className="text-xs font-bold text-violet-100 mb-3 text-center">
            Distress Profile Radar (Multidimensional)
          </div>
          <div className="h-48 w-full min-h-[192px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={180}>
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="#8b5cf6" />
                <PolarAngleAxis dataKey="subject" stroke="#ddd6fe" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#c4b5fd" />
                <Radar name="Distress Level" dataKey="A" stroke="#c084fc" fill="#a78bfa" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
