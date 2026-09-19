import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewAssessment from './pages/NewAssessment';
import TextAnalysis from './pages/TextAnalysis';
import VoiceAnalysis from './pages/VoiceAnalysis';
import AssessmentResult from './pages/AssessmentResult';
import Cases from './pages/Cases';
import CaseDetail from './pages/CaseDetail';
import SupportActions from './pages/SupportActions';
import Referrals from './pages/Referrals';
import AuditLog from './pages/AuditLog';
import Privacy from './pages/Privacy';

function App() {
  const [role, setRole] = useState('intake_operator');
  const [language, setLanguage] = useState('English');

  return (
    <Layout
      role={role}
      setRole={setRole}
      selectedLanguage={language}
      onLanguageChange={setLanguage}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard role={role} selectedLanguage={language} />} />
        
        {/* New Assessment Routes */}
        <Route path="/new-assessment" element={<NewAssessment role={role} selectedLanguage={language} setSelectedLanguage={setLanguage} />} />
        <Route path="/assessment/new" element={<NewAssessment role={role} selectedLanguage={language} setSelectedLanguage={setLanguage} />} />
        
        {/* Text Analysis Routes */}
        <Route path="/text-analysis" element={<TextAnalysis role={role} selectedLanguage={language} setSelectedLanguage={setLanguage} />} />
        <Route path="/assessment/text" element={<TextAnalysis role={role} selectedLanguage={language} setSelectedLanguage={setLanguage} />} />
        
        {/* Voice Analysis Routes */}
        <Route path="/voice-analysis" element={<VoiceAnalysis role={role} selectedLanguage={language} setSelectedLanguage={setLanguage} />} />
        <Route path="/assessment/voice" element={<VoiceAnalysis role={role} selectedLanguage={language} setSelectedLanguage={setLanguage} />} />
        
        {/* Assessment Result Routes */}
        <Route path="/assessment-result" element={<AssessmentResult role={role} selectedLanguage={language} />} />
        <Route path="/assessment/result" element={<AssessmentResult role={role} selectedLanguage={language} />} />
        
        <Route path="/cases" element={<Cases role={role} selectedLanguage={language} />} />
        <Route path="/cases/:caseId" element={<CaseDetail role={role} selectedLanguage={language} />} />
        <Route path="/support-actions" element={<SupportActions role={role} selectedLanguage={language} />} />
        <Route path="/referrals" element={<Referrals role={role} selectedLanguage={language} />} />
        <Route path="/audit-log" element={<AuditLog role={role} selectedLanguage={language} />} />
        <Route path="/privacy" element={<Privacy role={role} selectedLanguage={language} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
