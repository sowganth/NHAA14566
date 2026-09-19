import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Upload, Activity, CheckSquare, Sparkles, AlertCircle, Languages } from 'lucide-react';
import { api } from '../services/api';

const LANGUAGES = [
  "English", "Tamil", "Hindi", "Telugu", "Kannada", 
  "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu"
];

const SAMPLE_TRANSCRIPTS = {
  English: "He threatens me every day. I am terrified to leave my house. I have nowhere to go and no one to turn to for help.",
  Tamil: "அவர் என்னை தினமும் மிரட்டுகிறார். நான் வெளியே செல்லக்கூட பயப்படுகிறேன். எனக்கு வேறு வழி தெரியவில்லை, தயவுசெய்து உதவுங்கள்.",
  Hindi: "वह मुझे लगातार परेशान कर रहा है और जान से मारने की धमकी दे रहा है। उसके पास हथियार भी है।",
  Telugu: "అతను నన్ను ప్రతిరోజు బెదిరిస్తున్నాడు. ఇల్లు విడిచి వెళ్ళడానికి కూడా భయపడుతున్నాను. నాకు సహాయం కావాలి.",
  Kannada: "ಅವನು ನನ್ನನ್ನು ಪ್ರತಿದಿನ ಬೆದರಿಸುತ್ತಿದ್ದಾನೆ. ಮನೆಯಿಂದ ಹೊರಗೆ ಹೋಗಲು ಸಹ ಭಯವಾಗುತ್ತಿದೆ. ನನಗೆ ಸಹಾಯ ಬೇಕು.",
  Malayalam: "അവൻ എന്നെ ദിവസവും ഭീഷണിപ്പെടുത്തുന്നു. വീടിന് പുറത്തിറങ്ങാൻ പോലും പേടിയാണ്. എനിക്ക് സഹായം വേണം.",
  Marathi: "तो मला रोज धमकी देत आहे. घराबाहेर पडायलाही भीती वाटत आहे. मला मदतीची गरज आहे.",
  Bengali: "সে আমাকে প্রতিদিন হুমকি দিচ্ছে। ঘর থেকে বের হতেও ভয় করছে। আমার সাহায্য দরকার।",
  Gujarati: "તે મને રોજ ધમકી આપી રહ્યો છે. ઘરની બહાર નીકળવામાં પણ ડર લાગે છે. મને મદદ જોઈએ છે.",
  Punjabi: "ਉਹ ਮੈਨੂੰ ਰੋਜ਼ਾਨਾ ਧਮਕਾ ਰਿਹਾ ਹੈ। ਘਰੋਂ ਬਾਹਰ ਜਾਣ ਤੋਂ ਵੀ ਡਰ ਲੱਗ ਰਿਹਾ ਹੈ। ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
  Urdu: "وہ مجھے روزانہ دھمکی دے رہا ہے۔ گھر سے باہر نکلنے میں بھی خوف محسوس ہو رہا ہے۔ مجھے مدد کی ضرورت ہے۔"
};

export default function VoiceRecorder({ onAnalysisComplete, selectedLanguage = 'English', setSelectedLanguage, onError }) {
  const currentLang = selectedLanguage || 'English';
  const handleLangSelect = setSelectedLanguage || (() => {});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [manualTranscript, setManualTranscript] = useState('');
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [caseId, setCaseId] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [validationError, setValidationError] = useState('');

  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const handleLanguageChange = (lang) => {
    if (handleLangSelect) handleLangSelect(lang);
    setValidationError('');
    if (!manualTranscript.trim() || Object.values(SAMPLE_TRANSCRIPTS).includes(manualTranscript.trim())) {
      setManualTranscript(SAMPLE_TRANSCRIPTS[lang] || SAMPLE_TRANSCRIPTS.English);
    }
  };

  const startRecording = async () => {
    setValidationError('');
    audioChunksRef.current = [];
    setAudioUrl(null);
    setAudioBlob(null);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const url = URL.createObjectURL(blob);
          setAudioBlob(blob);
          setAudioUrl(url);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        setRecordingDuration(0);
        setIsDemoMode(false);
      } else {
        throw new Error('Microphone unavailable');
      }
    } catch (err) {
      setIsDemoMode(true);
      setIsRecording(true);
      setRecordingDuration(0);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);

    if (isDemoMode) {
      setAudioUrl('#demo-audio');
      setManualTranscript(SAMPLE_TRANSCRIPTS[currentLang] || SAMPLE_TRANSCRIPTS.English);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioBlob(file);
      setAudioUrl(url);
      setIsDemoMode(false);
      setValidationError('');
    }
  };

  const handleLoadDemoVoice = () => {
    setCaseId(`DEMO-VOICE-${currentLang.toUpperCase()}`);
    setIsDemoMode(true);
    setAudioUrl('#demo-audio');
    setManualTranscript(SAMPLE_TRANSCRIPTS[currentLang] || SAMPLE_TRANSCRIPTS.English);
    setConsent(true);
    setValidationError('');
  };

  const handleAnalyzeVoice = async () => {
    setValidationError('');

    if (!audioBlob && !audioUrl && !manualTranscript.trim()) {
      setValidationError('Please record voice audio, upload an audio file, or click "Load Demo Audio" first.');
      return;
    }

    if (!consent) {
      setValidationError('User consent is required before processing voice interaction.');
      return;
    }

    setLoading(true);
    try {
      const audioFile = audioBlob || null;
      const result = await api.analyzeVoice(audioFile, manualTranscript, currentLang, caseId, consent);
      onAnalysisComplete(result);
    } catch (err) {
      console.error(err);
      if (onError) onError(err.message || 'Error running voice acoustic analysis.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm warm-card-hover">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Voice & Speech Input</h2>
            <p className="text-xs text-slate-500">Acoustic prosody & speech emotion indicator extraction</p>
          </div>
        </div>

        <button
          onClick={handleLoadDemoVoice}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Load Demo Audio ({currentLang})</span>
        </button>
      </div>

      {validationError && (
        <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center space-x-2 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {isDemoMode && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between font-medium">
          <span className="font-bold flex items-center">
            <Activity className="w-4 h-4 mr-1.5 text-amber-600 animate-pulse" /> Demo Audio Processing Active
          </span>
          <span className="text-[11px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold">Simulated Mic Recording</span>
        </div>
      )}

      <div className="mt-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center">
              <Languages className="w-3.5 h-3.5 mr-1 text-amber-700" />
              Select Interaction Language
            </label>
            <select
              value={currentLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full bg-stone-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-white text-slate-800 font-medium">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Case / Reference ID <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="e.g. DEMO-14566-VOICE"
              className="w-full bg-stone-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
            />
          </div>
        </div>

        <div className="bg-stone-50/80 border border-slate-200/80 rounded-2xl p-5 flex flex-col items-center justify-center space-y-4">
          <div className="w-full h-18 bg-white rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-200/80 shadow-inner p-2">
            {isRecording ? (
              <div className="flex items-center space-x-1.5 animate-pulse">
                <span className="w-2.5 h-8 bg-rose-500 rounded-full"></span>
                <span className="w-2.5 h-12 bg-rose-600 rounded-full"></span>
                <span className="w-2.5 h-6 bg-rose-400 rounded-full"></span>
                <span className="text-xs text-rose-700 ml-2 font-mono font-extrabold">Recording Live Audio: {formatTime(recordingDuration)}</span>
              </div>
            ) : audioUrl ? (
              <div className="flex items-center space-x-2 text-xs text-emerald-800 font-bold bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                <Play className="w-4 h-4 text-emerald-600" />
                <span>Audio Stream Ready for Acoustic Feature Extraction</span>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-medium flex items-center">
                <Mic className="w-4 h-4 mr-1.5 text-amber-600" /> Click microphone button to start recording voice intake
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="flex items-center space-x-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold text-xs shadow-md transition-all cursor-pointer hover:scale-105"
              >
                <Mic className="w-4 h-4" />
                <span>Start Recording</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center space-x-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-xs shadow-md transition-all cursor-pointer animate-pulse"
              >
                <Square className="w-4 h-4" />
                <span>Stop Recording ({formatTime(recordingDuration)})</span>
              </button>
            )}

            <label className="flex items-center space-x-1.5 px-4 py-2.5 bg-white hover:bg-stone-50 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer border border-slate-200/90 shadow-sm transition-all">
              <Upload className="w-4 h-4 text-amber-600" />
              <span>Upload Audio</span>
              <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Speech Transcript ({currentLang})
          </label>
          <textarea
            rows={3}
            value={manualTranscript}
            onChange={(e) => setManualTranscript(e.target.value)}
            placeholder={`Voice transcript will appear here after recording in ${currentLang}...`}
            className="w-full bg-stone-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
          />
        </div>

        <div className="flex items-start space-x-2.5 pt-1">
          <input
            type="checkbox"
            id="voice-consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
          />
          <label htmlFor="voice-consent" className="text-xs text-slate-600 leading-normal cursor-pointer select-none font-medium">
            I consent to the confidential processing of my voice interaction for psychological distress assessment.
          </label>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleAnalyzeVoice}
            disabled={loading || isRecording}
            className="flex items-center space-x-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Acoustic Features ({currentLang})...</span>
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                <span>Analyze Voice Interaction ({currentLang})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
