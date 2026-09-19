import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Upload, RotateCcw, Activity, CheckSquare, Sparkles, AlertCircle, Languages } from 'lucide-react';
import { analyzeVoice } from '../services/api';

const LANGUAGES = [
  "English", "Tamil", "Hindi", "Telugu", "Kannada", 
  "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu"
];

const SAMPLE_TRANSCRIPTS = {
  English: "He threatens me every day. I am terrified to leave my house. I have nowhere to go and no one to turn to for help.",
  Tamil: "அவர் என்னை தினமும் மிரட்டுகிறார். நான் வெளியே செல்லக்கூட பயப்படுகிறேன். எனக்கு வேறு வழி தெரியவில்லை, தயவுசெய்து உதவுங்கள்.",
  Hindi: "वह मुझे लगातार परेशान कर रहा है और जान से मारने की धमकी दे रहा है। उसके पास हथियार भी है।",
  Telugu: "అతను నన్ను ప్రతిరోజూ బెదిరిస్తున్నాడు. ఇల్లు విడిచి వెళ్ళడానికి కూడా భయపడుతున్నాను. నాకు సహాయం కావాలి.",
  Kannada: "ಅವನು ನನ್ನನ್ನು ಪ್ರತಿದಿನ ಬೆದರಿಸುತ್ತಿದ್ದಾನೆ. ಮನೆಯಿಂದ ಹೊರಗೆ ಹೋಗಲು ಸಹ ಭಯವಾಗುತ್ತಿದೆ. ನನಗೆ ಸಹಾಯ ಬೇಕು.",
  Malayalam: "അവൻ എന്നെ ദിവസവും ഭീഷണിപ്പെടുത്തുന്നു. വീടിന് പുറത്തിറങ്ങാൻ പോലും പേടിയാണ്. എനിക്ക് സഹായം വേണം.",
  Marathi: "तो मला रोज धमकी देत आहे. घराबाहेर पडायलाही भीती वाटत आहे. मला मदतीची गरज आहे.",
  Bengali: "সে আমাকে প্রতিদিন হুমকি দিচ্ছে। ঘর থেকে বের হতেও ভয় করছে। আমার সাহায্য দরকার।",
  Gujarati: "તે મને રોજ ધમકી આપી રહ્યો છે. ઘરની બહાર નીકળવામાં પણ ડર લાગે છે. મને મદદ જોઈએ છે.",
  Punjabi: "ਉਹ ਮੈਨੂੰ ਰੋਜ਼ਾਨਾ ਧਮਕਾ ਰਿਹਾ ਹੈ। ਘਰੋਂ ਬਾਹਰ ਜਾਣ ਤੋਂ ਵੀ ਡਰ ਲੱਗ ਰਿਹਾ ਹੈ। ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
  Urdu: "وہ مجھے روزانہ دھمکی دے رہا ہے۔ گھر سے باہر نکلنے میں بھی خوف محسوس ہو رہا ہے۔ مجھے مدد کی ضرورت ہے۔"
};

export default function VoiceRecorder({ onAnalysisComplete, selectedLanguage, setSelectedLanguage, onError }) {
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
  const audioPlayerRef = useRef(null);
  const canvasRef = useRef(null);

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

  useEffect(() => {
    let animationFrameId;
    if (isRecording && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let phase = 0;

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#a855f7';
        ctx.beginPath();

        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;

        for (let x = 0; x < width; x += 3) {
          const v = Math.sin((x * 0.05) + phase) * Math.cos((x * 0.02) - phase) * (height * 0.35);
          ctx.lineTo(x, centerY + v);
        }
        ctx.stroke();

        phase += 0.15;
        animationFrameId = requestAnimationFrame(render);
      };
      render();
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRecording]);

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
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
        throw new Error('Browser microphone hardware access unavailable.');
      }
    } catch (err) {
      console.warn('Microphone access fallback to Mock/Demo Mode:', err);
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
      setManualTranscript(SAMPLE_TRANSCRIPTS[selectedLanguage] || SAMPLE_TRANSCRIPTS.English);
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
    setCaseId(`DEMO-VOICE-${selectedLanguage.toUpperCase()}`);
    setIsDemoMode(true);
    setAudioUrl('#demo-audio');
    setManualTranscript(SAMPLE_TRANSCRIPTS[selectedLanguage] || SAMPLE_TRANSCRIPTS.English);
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
      const result = await analyzeVoice(audioFile, manualTranscript, selectedLanguage, caseId, consent);
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-purple-600/20 text-purple-400 rounded-lg border border-purple-500/30">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Voice & Speech Input</h2>
            <p className="text-xs text-slate-400">Acoustic prosody & speech emotion indicator extraction</p>
          </div>
        </div>

        {/* Load Demo Audio Button */}
        <button
          onClick={handleLoadDemoVoice}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Demo Audio ({selectedLanguage})</span>
        </button>
      </div>

      {validationError && (
        <div className="mt-4 p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {isDemoMode && (
        <div className="mt-4 p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-lg text-xs text-amber-200 flex items-center justify-between">
          <span className="font-semibold flex items-center">
            <Activity className="w-4 h-4 mr-1.5 text-amber-400" /> Demo Audio Processing Mode Active
          </span>
          <span className="text-[11px] text-amber-400/80">Simulated Mic Recording</span>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {/* Row 1: Language & Optional Case ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center">
              <Languages className="w-3.5 h-3.5 mr-1 text-purple-400" />
              Select Interaction Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageSelect(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-purple-500 cursor-pointer shadow-inner"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-slate-900 text-white font-medium py-1">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Case / Reference ID <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="e.g. NHAA-VOICE-992"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 placeholder-slate-600"
            />
          </div>
        </div>

        {/* Live Microphone Recording Console */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center space-y-3">
          <div className="w-full h-16 bg-slate-900 rounded-lg overflow-hidden relative flex items-center justify-center border border-slate-800">
            {isRecording ? (
              <canvas ref={canvasRef} width={400} height={64} className="w-full h-full" />
            ) : audioUrl ? (
              <div className="flex items-center space-x-1 px-4">
                <span className="w-2 h-6 bg-purple-500 rounded"></span>
                <span className="w-2 h-10 bg-purple-400 rounded"></span>
                <span className="w-2 h-4 bg-purple-600 rounded"></span>
                <span className="w-2 h-8 bg-blue-500 rounded"></span>
                <span className="w-2 h-12 bg-blue-400 rounded"></span>
                <span className="w-2 h-6 bg-purple-500 rounded"></span>
                <span className="w-2 h-3 bg-slate-600 rounded"></span>
                <span className="text-xs text-slate-400 ml-3">Audio Ready for Feature Extraction</span>
              </div>
            ) : (
              <p className="text-xs text-slate-500 flex items-center">
                <Mic className="w-4 h-4 mr-1 text-slate-600" /> Click microphone button to start recording voice intake
              </p>
            )}

            {isRecording && (
              <div className="absolute top-2 right-2 bg-red-950 text-red-300 text-xs px-2.5 py-0.5 rounded-full border border-red-800 flex items-center space-x-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="font-mono font-bold">{formatTime(recordingDuration)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center space-x-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-semibold text-xs transition-all shadow-md shadow-purple-950/50 cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Start Recording</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-full font-semibold text-xs transition-all shadow-md shadow-red-950/50 cursor-pointer"
              >
                <Square className="w-4 h-4" />
                <span>Stop Recording ({formatTime(recordingDuration)})</span>
              </button>
            )}

            <label className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer transition-all border border-slate-700">
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              <span>Upload Audio</span>
              <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {audioUrl && (
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center">
                <Play className="w-3.5 h-3.5 mr-1 text-purple-400" /> Recorded Audio Preview
              </span>
              <span className="text-[11px] text-slate-500">Format: WAV / WebM Audio</span>
            </div>
            {audioUrl !== '#demo-audio' && (
              <audio ref={audioPlayerRef} src={audioUrl} controls className="w-full h-8" />
            )}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Speech-to-Text Transcript ({selectedLanguage}) <span className="text-slate-500 font-normal">(Auto-generated / Manual Override)</span>
          </label>
          <textarea
            rows={3}
            value={manualTranscript}
            onChange={(e) => setManualTranscript(e.target.value)}
            placeholder={`Voice transcript will appear here after recording in ${selectedLanguage}...`}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500 placeholder-slate-600 font-sans"
          />
        </div>

        <div className="flex items-start space-x-2.5 pt-1">
          <button
            type="button"
            onClick={() => setConsent(!consent)}
            className="mt-0.5 text-purple-400 focus:outline-none cursor-pointer"
          >
            {consent ? (
              <CheckSquare className="w-4 h-4 text-emerald-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-500" />
            )}
          </button>
          <label className="text-xs text-slate-300 leading-normal cursor-pointer select-none" onClick={() => setConsent(!consent)}>
            I consent to the processing of my voice interaction for acoustic feature extraction and support assessment.
          </label>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-slate-800">
          <button
            onClick={handleAnalyzeVoice}
            disabled={loading || isRecording}
            className="flex items-center space-x-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-950 text-white rounded-lg text-xs font-semibold shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Acoustic Features ({selectedLanguage})...</span>
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                <span>Analyze Voice Interaction ({selectedLanguage})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
