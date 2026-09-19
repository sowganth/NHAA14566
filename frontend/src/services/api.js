const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function handleResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorData.detail || `Server error (${res.status})`);
  }
  return res.json();
}

export const api = {
  // Health
  async checkHealth() {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    return handleResponse(res);
  },

  // Module 1: Interaction Analysis
  async analyzeText(text, language = 'English', case_id = null, consent = true) {
    const res = await fetch(`${API_BASE_URL}/api/v1/module1/analyze-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language, case_id, consent })
    });
    return handleResponse(res);
  },

  async analyzeVoice(audioFile, transcriptText = null, language = 'Tamil', case_id = null, consent = true) {
    const formData = new FormData();
    formData.append('language', language);
    if (case_id) formData.append('case_id', case_id);
    if (transcriptText) formData.append('transcript', transcriptText);
    formData.append('consent', consent ? 'true' : 'false');
    if (audioFile) formData.append('audio_file', audioFile);

    const res = await fetch(`${API_BASE_URL}/api/v1/module1/analyze-voice`, {
      method: 'POST',
      body: formData
    });
    return handleResponse(res);
  },

  // Module 2: SVI Assessment
  async calculateSvi(payload) {
    const res = await fetch(`${API_BASE_URL}/api/v1/module2/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async getSviConfig() {
    const res = await fetch(`${API_BASE_URL}/api/v1/module2/config`);
    return handleResponse(res);
  },

  // Module 3: Support Recommendations & Case Management
  async getDashboardSummary() {
    const res = await fetch(`${API_BASE_URL}/api/v1/module3/dashboard/summary`);
    return handleResponse(res);
  },

  async getCases(params = {}) {
    const query = new URLSearchParams();
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
        query.append(k, params[k]);
      }
    });
    const res = await fetch(`${API_BASE_URL}/api/v1/module3/cases?${query.toString()}`);
    return handleResponse(res);
  },

  async getCase(caseId) {
    const res = await fetch(`${API_BASE_URL}/api/v1/module3/case/${caseId}`);
    return handleResponse(res);
  },

  async updateCaseStatus(caseId, status, reason) {
    const res = await fetch(`${API_BASE_URL}/api/v1/module3/case/${caseId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason })
    });
    return handleResponse(res);
  },

  async assignCase(caseId, assignedTo) {
    const res = await fetch(`${API_BASE_URL}/api/v1/module3/case/${caseId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assigned_to: assignedTo })
    });
    return handleResponse(res);
  },

  async addCaseNote(caseId, note, visibility = 'AUTHORIZED_STAFF') {
    const res = await fetch(`${API_BASE_URL}/api/v1/module3/case/${caseId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note, visibility })
    });
    return handleResponse(res);
  },

  async createReferral(caseId, referralType, destination, notes = null) {
    const res = await fetch(`${API_BASE_URL}/api/v1/module3/case/${caseId}/referral`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referral_type: referralType, destination, notes })
    });
    return handleResponse(res);
  },

  async getReferrals() {
    const res = await fetch(`${API_BASE_URL}/api/v1/module3/referrals`);
    return handleResponse(res);
  },

  async getAuditLogs(caseId = null) {
    const query = caseId ? `?case_id=${encodeURIComponent(caseId)}` : '';
    const res = await fetch(`${API_BASE_URL}/api/v1/module3/audit-logs${query}`);
    return handleResponse(res);
  },

  // Full End-to-End Pipeline Execution (Module 1 -> Module 2 -> Module 3)
  async runFullAssessment(data) {
    const res = await fetch(`${API_BASE_URL}/api/v1/assessment/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  }
};
