import React from 'react';
import { Mic, Activity, Clock, Gauge, Zap } from 'lucide-react';

export default function VoiceMetricsCard({ speechFeatures }) {
  if (!speechFeatures) return null;

  const {
    speech_rate = 120,
    pause_frequency = 4,
    pitch_variation = 35,
    intensity = 65,
    hesitation = 50
  } = speechFeatures;

  const getMetricColor = (val, threshold) => {
    if (val >= threshold) return 'text-amber-700 font-extrabold';
    return 'text-slate-800';
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm warm-card-hover space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center">
          <div className="p-1.5 bg-purple-50 text-purple-700 rounded-lg mr-2">
            <Mic className="w-4 h-4" />
          </div>
          <span>Acoustic Speech & Prosody Feature Extraction</span>
        </h3>
        <span className="text-xs text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 font-mono font-bold">
          Voice Cues
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/70 space-y-1">
          <span className="text-[11px] text-slate-500 block flex items-center font-medium">
            <Clock className="w-3 h-3 mr-1 text-slate-400" /> Speech Rate
          </span>
          <span className="text-lg font-bold font-mono text-slate-800">{speech_rate} <span className="text-xs text-slate-400 font-sans">WPM</span></span>
          <span className="text-[10px] text-slate-400 block">Baseline: ~150 WPM</span>
        </div>

        <div className="bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/70 space-y-1">
          <span className="text-[11px] text-slate-500 block flex items-center font-medium">
            <Activity className="w-3 h-3 mr-1 text-amber-600" /> Pause Frequency
          </span>
          <span className={`text-lg font-bold font-mono ${getMetricColor(pause_frequency, 6)}`}>{pause_frequency} <span className="text-xs text-slate-400 font-sans">pauses/min</span></span>
          <span className="text-[10px] text-slate-400 block">Long hesitation breaks</span>
        </div>

        <div className="bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/70 space-y-1">
          <span className="text-[11px] text-slate-500 block flex items-center font-medium">
            <Gauge className="w-3 h-3 mr-1 text-purple-600" /> Pitch Variation
          </span>
          <span className={`text-lg font-bold font-mono ${getMetricColor(pitch_variation, 40)}`}>{pitch_variation} <span className="text-xs text-slate-400 font-sans">Hz</span></span>
          <span className="text-[10px] text-slate-400 block">Vocal tremor & pitch variance</span>
        </div>

        <div className="bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/70 space-y-1">
          <span className="text-[11px] text-slate-500 block flex items-center font-medium">
            <Zap className="w-3 h-3 mr-1 text-blue-600" /> Voice Intensity
          </span>
          <span className="text-lg font-bold font-mono text-slate-800">{intensity} <span className="text-xs text-slate-400 font-sans">dB</span></span>
          <span className="text-[10px] text-slate-400 block">Energy modulation</span>
        </div>

        <div className="bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/70 space-y-1">
          <span className="text-[11px] text-slate-500 block flex items-center font-medium">
            <Activity className="w-3 h-3 mr-1 text-rose-600" /> Hesitation Index
          </span>
          <span className={`text-lg font-bold font-mono ${getMetricColor(hesitation, 60)}`}>{hesitation}%</span>
          <span className="text-[10px] text-slate-400 block">Tremor probability</span>
        </div>
      </div>
    </div>
  );
}
