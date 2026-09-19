import React from 'react';
import TextInput from '../components/TextInput';
import PrivacyNotice from '../components/PrivacyNotice';

export default function TextAnalysis({ onAnalysisComplete, selectedLanguage, setSelectedLanguage, onError }) {
  return (
    <div className="space-y-6">
      <PrivacyNotice compact selectedLanguage={selectedLanguage} />
      <TextInput
        onAnalysisComplete={onAnalysisComplete}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        onError={onError}
      />
    </div>
  );
}
