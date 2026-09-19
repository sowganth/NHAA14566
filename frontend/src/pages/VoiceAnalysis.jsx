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
    <div className="space-y-6">
      <VoiceRecorder
        onAnalysisComplete={setResult}
        selectedLanguage={currentLang}
        setSelectedLanguage={setSelectedLanguage || (() => {})}
        onError={setError}
      />

      {error && (
        <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6 pt-4 border-t border-slate-800">
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
