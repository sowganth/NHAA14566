const API_BASE_URL = '/api';

export async function fetchHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) throw new Error('Backend health check failed');
  return response.json();
}

export async function fetchLanguages() {
  const response = await fetch(`${API_BASE_URL}/languages`);
  if (!response.ok) throw new Error('Failed to fetch languages');
  return response.json();
}

export async function fetchDemoCases() {
  const response = await fetch(`${API_BASE_URL}/demo-cases`);
  if (!response.ok) throw new Error('Failed to fetch demo cases');
  return response.json();
}

export async function analyzeText(text, language = 'English', caseId = null, consent = true) {
  const response = await fetch(`${API_BASE_URL}/analyze-text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      language,
      case_id: caseId || undefined,
      consent,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Analysis request failed' }));
    throw new Error(errorData.detail || 'Text analysis failed');
  }

  return response.json();
}

export async function analyzeVoice(audioFile, transcriptText, language = 'Tamil', caseId = null, consent = true) {
  const formData = new FormData();
  formData.append('language', language);
  formData.append('consent', consent ? 'true' : 'false');
  if (caseId) formData.append('case_id', caseId);
  if (transcriptText) formData.append('transcript', transcriptText);
  if (audioFile) formData.append('audio_file', audioFile);

  const response = await fetch(`${API_BASE_URL}/analyze-voice`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Voice analysis request failed' }));
    throw new Error(errorData.detail || 'Voice analysis failed');
  }

  return response.json();
}

export async function fetchAssessmentsHistory() {
  const response = await fetch(`${API_BASE_URL}/assessments`);
  if (!response.ok) throw new Error('Failed to fetch assessment history');
  return response.json();
}

export async function fetchAssessmentDetail(id) {
  const response = await fetch(`${API_BASE_URL}/assessments/${id}`);
  if (!response.ok) throw new Error('Failed to fetch assessment details');
  return response.json();
}
