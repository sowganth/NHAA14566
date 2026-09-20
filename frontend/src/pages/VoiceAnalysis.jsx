import React, { useState } from 'react';
import VoiceRecorder from '../components/VoiceRecorder';
import VoiceMetricsCard from '../components/VoiceMetricsCard';
import EmotionChart from '../components/EmotionChart';
import IndicatorCard from '../components/IndicatorCard';
import ExplainabilityCard from '../components/ExplainabilityCard';

export default function VoiceAnalysis({ selectedLanguage = 'English', setSelectedLanguage }) {
  const currentLang = selectedLanguage || 'English';
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  return (
    <div className="space-y-6 p-1 sm:p-2">
      <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-purple-700 p-6 rounded-2xl border border-violet-300/30 shadow-[0_18px_45px_rgba(168,85,247,0.35)]">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-violet-200/20 text-violet-100 rounded-xl border border-violet-200/30 shadow-inner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
              <path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Zm-6 9a6 6 0 0 0 12 0M12 18v3m-4 0h8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Module 2 — Voice Stress & Emotion Analysis</h1>
            <p className="text-xs text-violet-100/80">Acoustic signal, trauma cues, and urgency indicators for live voice intake</p>
          </div>
        </div>
      </div>

      <VoiceRecorder
        onAnalysisComplete={setResult}
        selectedLanguage={currentLang}
        setSelectedLanguage={setSelectedLanguage || (() => {})}
        onError={setError}
      />

      {error && (
        <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6 pt-4 border-t border-violet-500/20">
          <VoiceMetricsCard speechFeatures={result.speech_features} />
          <IndicatorCard
            indicators={result.indicators}
            traumaIndicators={result.trauma_indicators}
            vulnerabilityIndicators={result.vulnerability_indicators}
            urgentSafetyIndicators={result.urgent_safety_indicators}
            urgentReview={result.urgent_review}
          />
          <EmotionChart emotionScores={result.emotion_scores} />
          <ExplainabilityCard explainability={result.explainability} confidence={result.confidence} />
        </div>
      )}
    </div>
  );
}
