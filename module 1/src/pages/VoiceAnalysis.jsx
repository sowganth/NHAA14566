import React from 'react';
import VoiceRecorder from '../components/VoiceRecorder';
import PrivacyNotice from '../components/PrivacyNotice';

export default function VoiceAnalysis({ onAnalysisComplete, selectedLanguage, setSelectedLanguage, onError }) {
  return (
    <div className="space-y-6">
      <PrivacyNotice compact selectedLanguage={selectedLanguage} />
      <VoiceRecorder
        onAnalysisComplete={onAnalysisComplete}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        onError={onError}
      />
    </div>
  );
}
