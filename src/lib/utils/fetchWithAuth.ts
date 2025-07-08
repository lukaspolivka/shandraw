import config from '@/config';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem(config.token_name);
  const headers = { ...options.headers, Authorization: `Bearer ${token}` };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export default fetchWithAuth;
