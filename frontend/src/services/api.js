const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

async function handleResponse(res, url) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const detail = errorData.detail || res.statusText || 'Request failed';
    throw new Error(`${detail} [${res.status} ${res.statusText}] URL: ${url}`);
  }
  return res.json();
}

async function request(path, options) {
  const url = `${API_BASE_URL}${path}`;
  try {
    const res = await fetch(url, options);
    return handleResponse(res, url);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Network error while calling ${url}: ${error.message}`);
    }
    throw error;
  }
}

export const api = {
  // Health
  async checkHealth() {
    return request('/api/health');
  },

  // Module 1: Interaction Analysis
  async analyzeText(text, language = 'English', case_id = null, consent = true) {
    return request('/api/v1/module1/analyze-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language, case_id, consent })
    });
  },

  async analyzeVoice(audioFile, transcriptText = null, language = 'Tamil', case_id = null, consent = true) {
    const formData = new FormData();
    formData.append('language', language);
    if (case_id) formData.append('case_id', case_id);
    if (transcriptText) formData.append('transcript', transcriptText);
    formData.append('consent', consent ? 'true' : 'false');
    if (audioFile) formData.append('audio_file', audioFile);

    return request('/api/v1/module1/analyze-voice', {
      method: 'POST',
      body: formData
    });
  },

  // Module 2: SVI Assessment
  async calculateSvi(payload) {
    return request('/api/v1/module2/assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async getSviConfig() {
    return request('/api/v1/module2/config');
  },

  // Module 3: Support Recommendations & Case Management
  async getDashboardSummary() {
    return request('/api/v1/module3/dashboard/summary');
  },

  async getCases(params = {}) {
    const query = new URLSearchParams();
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
        query.append(k, params[k]);
      }
    });
    return request(`/api/v1/module3/cases?${query.toString()}`);
  },

  async getCase(caseId) {
    return request(`/api/v1/module3/case/${caseId}`);
  },

  async updateCaseStatus(caseId, status, reason) {
    return request(`/api/v1/module3/case/${caseId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason })
    });
  },

  async assignCase(caseId, assignedTo) {
    return request(`/api/v1/module3/case/${caseId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assigned_to: assignedTo })
    });
  },

  async addCaseNote(caseId, note, visibility = 'AUTHORIZED_STAFF') {
    return request(`/api/v1/module3/case/${caseId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note, visibility })
    });
  },

  async createReferral(caseId, referralType, destination, notes = null) {
    return request(`/api/v1/module3/case/${caseId}/referral`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referral_type: referralType, destination, notes })
    });
  },

  async getReferrals() {
    return request('/api/v1/module3/referrals');
  },

  async getAuditLogs(caseId = null) {
    const query = caseId ? `?case_id=${encodeURIComponent(caseId)}` : '';
    return request(`/api/v1/module3/audit-logs${query}`);
  },

  // Full End-to-End Pipeline Execution (Module 1 -> Module 2 -> Module 3)
  async runFullAssessment(data) {
    return request('/api/v1/assessment/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};
