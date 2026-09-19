import React from 'react';
import { Mic, Activity, Volume2, Clock, PauseCircle, AlertCircle } from 'lucide-react';

export default function VoiceMetricsCard({ speechFeatures, transcript, demoNotice }) {
  if (!speechFeatures) return null;

  const {
    speech_rate = 120,
    pause_frequency = 3,
    pitch_variation = 25,
    intensity = 60,
    hesitation = 40
  } = speechFeatures;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-md">
            <Mic className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Voice Acoustic Feature Analysis</h3>
        </div>

        {demoNotice && (
          <div className="bg-amber-950/80 border border-amber-800/80 text-amber-300 text-xs px-2.5 py-1 rounded font-semibold flex items-center">
            <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-400" />
            <span>{demoNotice}</span>
          </div>
        )}
      </div>

      {/* Grid of Acoustic Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-center">
            <Clock className="w-3 h-3 mr-1 text-purple-400" /> Speech Rate
          </div>
          <div className="text-base font-bold font-mono text-white">{speech_rate} <span className="text-xs font-normal text-slate-400">WPM</span></div>
          <div className="text-[10px] text-slate-500">Words per minute</div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-center">
            <PauseCircle className="w-3 h-3 mr-1 text-blue-400" /> Pause Frequency
          </div>
          <div className="text-base font-bold font-mono text-white">{pause_frequency} <span className="text-xs font-normal text-slate-400">/ 10s</span></div>
          <div className="text-[10px] text-slate-500">Interruption density</div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-center">
            <Activity className="w-3 h-3 mr-1 text-amber-400" /> Pitch Variation
          </div>
          <div className="text-base font-bold font-mono text-white">{pitch_variation} <span className="text-xs font-normal text-slate-400">Hz</span></div>
          <div className="text-[10px] text-slate-500">Frequency jitter</div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-center">
            <Volume2 className="w-3 h-3 mr-1 text-emerald-400" /> Speech Intensity
          </div>
          <div className="text-base font-bold font-mono text-white">{intensity} <span className="text-xs font-normal text-slate-400">dB</span></div>
          <div className="text-[10px] text-slate-500">Relative loudness</div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-center">
            <Mic className="w-3 h-3 mr-1 text-red-400" /> Hesitation Index
          </div>
          <div className="text-base font-bold font-mono text-white">{hesitation}%</div>
          <div className="text-[10px] text-slate-500">Vocal tremor score</div>
        </div>
      </div>

      {/* Transcript Display Box */}
      {transcript && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-1.5">
          <div className="text-xs font-semibold text-slate-300">Speech-to-Text Transcript:</div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900 p-2.5 rounded border border-slate-800 italic">
            "{transcript}"
          </p>
        </div>
      )}
    </div>
  );
}
