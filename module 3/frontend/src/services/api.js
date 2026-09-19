const getActiveRole = () => localStorage.getItem('nhaa_role') || 'SUPERVISOR';
const getActiveUserId = () => localStorage.getItem('nhaa_user_id') || 'OFFICER-001';

export const setActiveRole = (role) => {
  localStorage.setItem('nhaa_role', role);
  window.dispatchEvent(new Event('nhaa_role_changed'));
};

export const setActiveUserId = (userId) => {
  localStorage.setItem('nhaa_user_id', userId);
};

export const fetchApi = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': getActiveUserId(),
    'x-user-role': getActiveRole(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP Error ${response.status}`);
  }

  return response.json();
};
