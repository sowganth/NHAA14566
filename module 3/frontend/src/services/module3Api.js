import { fetchApi } from './api';

export const module3Api = {
  // Recommend support
  recommendSupport: (data) => fetchApi('/api/v1/module3/recommend-support', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Get dashboard summary
  getDashboard: () => fetchApi('/api/v1/module3/dashboard'),

  // List cases with query filters
  getCases: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return fetchApi(`/api/v1/module3/cases?${query.toString()}`);
  },

  // Get case detail
  getCaseDetail: (caseId) => fetchApi(`/api/v1/module3/case/${caseId}`),

  // Update status
  updateStatus: (caseId, status, reason) => fetchApi(`/api/v1/module3/case/${caseId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reason }),
  }),

  // Assign case
  assignCase: (caseId, assignedTo) => fetchApi(`/api/v1/module3/case/${caseId}/assign`, {
    method: 'POST',
    body: JSON.stringify({ assigned_to: assignedTo }),
  }),

  // Add note
  addNote: (caseId, note, visibility = 'AUTHORIZED_STAFF') => fetchApi(`/api/v1/module3/case/${caseId}/notes`, {
    method: 'POST',
    body: JSON.stringify({ note, visibility }),
  }),

  // Create referral
  createReferral: (caseId, referralType, destination, notes) => fetchApi(`/api/v1/module3/case/${caseId}/referrals`, {
    method: 'POST',
    body: JSON.stringify({ referral_type: referralType, destination, notes }),
  }),

  // Get all referrals
  getReferrals: () => fetchApi('/api/v1/module3/referrals'),

  // Get audit logs
  getAuditLogs: (caseId) => {
    const query = caseId ? `?case_id=${caseId}` : '';
    return fetchApi(`/api/v1/module3/audit-logs${query}`);
  },

  // Full Pipeline Execution (Module 1 -> Module 2 -> Module 3)
  runFullAssessment: (data) => fetchApi('/api/v1/assessment/run', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Health check
  getHealth: () => fetchApi('/api/health'),
};
