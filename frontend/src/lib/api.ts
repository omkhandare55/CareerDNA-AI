const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export async function apiGet<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function apiPost<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: getAuthHeaders(), body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function apiPatch<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { method: 'PATCH', headers: getAuthHeaders(), body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
}

// SSE stream helper for agent recommendations
export function apiStream(path: string, body: any, onEvent: (data: any) => void, onDone: () => void) {
  fetch(`${API_BASE}${path}`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) })
    .then(res => {
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      function read() {
        reader?.read().then(({ done, value }) => {
          if (done) { onDone(); return; }
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try { onEvent(JSON.parse(line.slice(6))); } catch {}
            }
          }
          read();
        });
      }
      read();
    });
}
