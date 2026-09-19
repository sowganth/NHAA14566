import React from 'react';
import EmotionChart from '../components/EmotionChart';
import IndicatorCard from '../components/IndicatorCard';
import ExplainabilityCard from '../components/ExplainabilityCard';
import VoiceMetricsCard from '../components/VoiceMetricsCard';
import PrivacyNotice from '../components/PrivacyNotice';
import { t } from '../utils/translations';
import { ArrowLeft, Printer, ShieldAlert, CheckCircle, FileText, Mic } from 'lucide-react';

export default function Results({ analysisResult, selectedLanguage = 'English', onReset }) {
  if (!analysisResult) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4">
        <p className="text-sm text-slate-400">No interaction analysis result loaded.</p>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow cursor-pointer"
        >
          Start New Assessment
        </button>
      </div>
    );
  }

  const {
    case_id = 'NHAA-EVAL-001',
    language = selectedLanguage || 'English',
    analysis_type = 'Text',
    emotion_scores = {},
    indicators = [],
    trauma_indicators = [],
    vulnerability_indicators = [],
    urgent_safety_indicators = [],
    urgent_review = false,
    confidence = 85,
    explainability = [],
    speech_features = null,
    transcript = '',
    demo_notice = null
  } = analysisResult;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4 print:p-0">
      {/* Top Controls Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <button
          onClick={onReset}
          className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-lg font-medium transition-all w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('nav_new_assessment', language)}</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Export Assessment Report</span>
          </button>
        </div>
      </div>

      {/* Main Results Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Intake Assessment Summary</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono font-bold text-amber-400">Case ID: {case_id}</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">{t('results_title', language)}</h2>
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-3">
            {urgent_review ? (
              <div className="bg-red-950 border-2 border-red-600 text-red-200 text-xs px-3.5 py-1.5 rounded-lg font-bold flex items-center shadow-lg animate-pulse">
                <ShieldAlert className="w-4 h-4 mr-1.5 text-red-400" />
                <span>{t('urgent_review_required', language)}</span>
              </div>
            ) : (
              <div className="bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center">
                <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-400" />
                <span>Standard Human Review</span>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Details Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs">
          <div>
            <div className="text-slate-400 font-medium">Detected Language</div>
            <div className="text-white font-bold mt-0.5">{language}</div>
          </div>

          <div>
            <div className="text-slate-400 font-medium">Analysis Method</div>
            <div className="text-white font-bold mt-0.5 flex items-center">
              {analysis_type === 'Voice' ? (
                <Mic className="w-3.5 h-3.5 mr-1 text-purple-400" />
              ) : (
                <FileText className="w-3.5 h-3.5 mr-1 text-blue-400" />
              )}
              {analysis_type} Interaction
            </div>
          </div>

          <div>
            <div className="text-slate-400 font-medium">AI Confidence Score</div>
            <div className="text-blue-400 font-bold font-mono mt-0.5">{confidence}%</div>
          </div>

          <div>
            <div className="text-slate-400 font-medium">Human Review Routing</div>
            <div className={urgent_review ? 'text-red-400 font-bold mt-0.5' : 'text-emerald-400 font-semibold mt-0.5'}>
              {urgent_review ? 'Priority Escalation' : 'Standard Queue'}
            </div>
          </div>
        </div>
      </div>

      {/* Non-clinical Privacy Disclaimer */}
      <PrivacyNotice compact selectedLanguage={language} />

      {/* Indicator Detection Section */}
      <IndicatorCard
        indicators={indicators}
        traumaIndicators={trauma_indicators}
        vulnerabilityIndicators={vulnerability_indicators}
        urgentSafetyIndicators={urgent_safety_indicators}
        urgentReview={urgent_review}
      />

      {/* Emotion Scores Section (Bar + Radar) */}
      <EmotionChart emotionScores={emotion_scores} />

      {/* Voice Acoustic Metrics Breakdown (if Voice analysis) */}
      {analysis_type === 'Voice' && (
        <VoiceMetricsCard
          speechFeatures={speech_features}
          transcript={transcript}
          demoNotice={demo_notice}
        />
      )}

      {/* Model Explainability Card ("Why was this detected?") */}
      <ExplainabilityCard explainability={explainability} confidence={confidence} />
    </div>
  );
}
