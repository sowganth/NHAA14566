import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TextAnalysis from './pages/TextAnalysis';
import VoiceAnalysis from './pages/VoiceAnalysis';
import Results from './pages/Results';
import Privacy from './pages/Privacy';
import { analyzeText } from './services/api';
import { t } from './utils/translations';
import { AlertCircle, FileText, Mic } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'voice' for new assessment
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // DEFAULT LANGUAGE IS ENGLISH
  const [analysisResult, setAnalysisResult] = useState(null);
  const [globalError, setGlobalError] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setGlobalError(null);
    setCurrentPage('results');
  };

  const handleSelectAssessment = (record) => {
    setAnalysisResult(record);
    setGlobalError(null);
    setCurrentPage('results');
  };

  const handleLoadDemoCase = async () => {
    setDemoLoading(true);
    setGlobalError(null);
    try {
      const demoNarrative = selectedLanguage === 'Tamil'
        ? 'அவர் என்னை தினமும் மிரட்டுகிறார். நான் காவல் நிலையத்திற்கு புகார் அளிக்கச் சென்றால் என்னை கொன்றுவிடுவதாகப் பயமுறுத்துகிறார். வீட்டை விட்டு வெளியே செல்லவும் பயமாக இருக்கிறது. கத்தியைக் காட்டி அச்சுறுத்தினார்.'
        : selectedLanguage === 'Hindi'
        ? 'वह मुझे लगातार परेशान कर रहा है और जान से मारने की धमकी दे रहा है। उसके पास हथियार भी है। मुझे अपने और अपने बच्चों के लिए बहुत डर लग रहा है।'
        : 'My neighbor has been repeatedly threatening my family and following me whenever I go out. He warned that if I inform the police, he will attack my children. I feel completely trapped inside my house with no support system nearby.';

      const result = await analyzeText(demoNarrative, selectedLanguage, `DEMO-14566-${selectedLanguage.toUpperCase()}`, true);
      setAnalysisResult(result);
      setCurrentPage('results');
    } catch (err) {
      console.error(err);
      setGlobalError('Failed to execute demo case analysis. Ensure Python FastAPI backend is running on http://127.0.0.1:8000.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Government Style Header */}
      <Header
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          selectedLanguage={selectedLanguage}
          hasResults={!!analysisResult}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Global Error Banner if API fails */}
          {globalError && (
            <div className="mb-6 p-4 bg-red-950/80 border-2 border-red-700 rounded-xl text-xs text-red-200 flex items-start space-x-3 shadow-lg">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="text-red-100 font-bold block text-sm">System Communication Notice</strong>
                <span className="mt-1 block">{globalError}</span>
                <span className="text-[11px] text-red-300 mt-2 block font-mono">
                  Tip: Start the backend using: <code className="bg-red-900/60 px-1.5 py-0.5 rounded text-white">python backend/main.py</code>
                </span>
              </div>
            </div>
          )}

          {demoLoading && (
            <div className="mb-6 p-4 bg-amber-950/80 border border-amber-700 rounded-xl text-xs text-amber-200 flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin"></div>
              <span>Executing Demo NLP Analysis ({selectedLanguage})...</span>
            </div>
          )}

          {/* Page 1: Dashboard */}
          {currentPage === 'dashboard' && (
            <Dashboard
              onNavigate={setCurrentPage}
              onSelectAssessment={handleSelectAssessment}
              onLoadDemoCase={handleLoadDemoCase}
              selectedLanguage={selectedLanguage}
            />
          )}

          {/* Page 2: New Assessment (Tabs for Text vs Voice Input) */}
          {currentPage === 'new-assessment' && (
            <div className="space-y-6">
              {/* Tab Selector Buttons */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex space-x-2">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'text'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>{t('tab_text', selectedLanguage)}</span>
                </button>

                <button
                  onClick={() => setActiveTab('voice')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'voice'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{t('tab_voice', selectedLanguage)}</span>
                </button>
              </div>

              {activeTab === 'text' ? (
                <TextAnalysis
                  onAnalysisComplete={handleAnalysisComplete}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  onError={setGlobalError}
                />
              ) : (
                <VoiceAnalysis
                  onAnalysisComplete={handleAnalysisComplete}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  onError={setGlobalError}
                />
              )}
            </div>
          )}

          {/* Page 3: Text Analysis Dedicated */}
          {currentPage === 'text-analysis' && (
            <TextAnalysis
              onAnalysisComplete={handleAnalysisComplete}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              onError={setGlobalError}
            />
          )}

          {/* Page 4: Voice Analysis Dedicated */}
          {currentPage === 'voice-analysis' && (
            <VoiceAnalysis
              onAnalysisComplete={handleAnalysisComplete}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              onError={setGlobalError}
            />
          )}

          {/* Page 5: Results & Report */}
          {currentPage === 'results' && (
            <Results
              analysisResult={analysisResult}
              selectedLanguage={selectedLanguage}
              onReset={() => setCurrentPage('new-assessment')}
            />
          )}

          {/* Page 6: Privacy & Governance */}
          {currentPage === 'privacy' && <Privacy selectedLanguage={selectedLanguage} />}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t('app_title', selectedLanguage)} — {t('app_subtitle', selectedLanguage)}</span>
          <span className="text-slate-400 font-medium">NHAA 14566 Decision Support System Prototype</span>
        </div>
      </footer>
    </div>
  );
}
