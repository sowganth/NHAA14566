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
    if (val >= threshold) return 'text-violet-200 font-extrabold';
    return 'text-white';
  };

  return (
    <div className="bg-slate-900/80 border border-violet-500/20 rounded-2xl p-6 shadow-[0_18px_45px_rgba(15,23,42,0.35)] space-y-4">
      <div className="flex items-center justify-between border-b border-violet-500/20 pb-3">
        <h3 className="text-sm font-bold text-white flex items-center">
          <div className="p-1.5 bg-violet-500/20 text-violet-200 rounded-lg mr-2 border border-violet-400/30">
            <Mic className="w-4 h-4" />
          </div>
          <span>Acoustic Speech & Prosody Feature Extraction</span>
        </h3>
        <span className="text-xs text-violet-100 bg-violet-500/15 px-2.5 py-0.5 rounded-full border border-violet-400/30 font-mono font-bold">
          Voice Cues
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-violet-500/20 space-y-1">
          <span className="text-[11px] text-violet-100/80 block flex items-center font-medium">
            <Clock className="w-3 h-3 mr-1 text-violet-300" /> Speech Rate
          </span>
          <span className="text-lg font-bold font-mono text-white">{speech_rate} <span className="text-xs text-slate-400 font-sans">WPM</span></span>
          <span className="text-[10px] text-slate-400 block">Baseline: ~150 WPM</span>
        </div>

        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-violet-500/20 space-y-1">
          <span className="text-[11px] text-violet-100/80 block flex items-center font-medium">
            <Activity className="w-3 h-3 mr-1 text-violet-300" /> Pause Frequency
          </span>
          <span className={`text-lg font-bold font-mono ${getMetricColor(pause_frequency, 6)}`}>{pause_frequency} <span className="text-xs text-slate-400 font-sans">pauses/min</span></span>
          <span className="text-[10px] text-slate-400 block">Long hesitation breaks</span>
        </div>

        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-violet-500/20 space-y-1">
          <span className="text-[11px] text-violet-100/80 block flex items-center font-medium">
            <Gauge className="w-3 h-3 mr-1 text-violet-300" /> Pitch Variation
          </span>
          <span className={`text-lg font-bold font-mono ${getMetricColor(pitch_variation, 40)}`}>{pitch_variation} <span className="text-xs text-slate-400 font-sans">Hz</span></span>
          <span className="text-[10px] text-slate-400 block">Vocal tremor & pitch variance</span>
        </div>

        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-violet-500/20 space-y-1">
          <span className="text-[11px] text-violet-100/80 block flex items-center font-medium">
            <Zap className="w-3 h-3 mr-1 text-violet-300" /> Voice Intensity
          </span>
          <span className="text-lg font-bold font-mono text-white">{intensity} <span className="text-xs text-slate-400 font-sans">dB</span></span>
          <span className="text-[10px] text-slate-400 block">Energy modulation</span>
        </div>

        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-violet-500/20 space-y-1">
          <span className="text-[11px] text-violet-100/80 block flex items-center font-medium">
            <Activity className="w-3 h-3 mr-1 text-violet-300" /> Hesitation Index
          </span>
          <span className={`text-lg font-bold font-mono ${getMetricColor(hesitation, 60)}`}>{hesitation}%</span>
          <span className="text-[10px] text-slate-400 block">Tremor probability</span>
        </div>
      </div>
    </div>
  );
}
