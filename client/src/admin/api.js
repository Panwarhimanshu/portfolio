// Small fetch wrapper for the admin API. Throws an Error with the server's message.
export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api/admin${path}`, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadFile(file) {
  if (file.size > 3 * 1024 * 1024) throw new Error('Files can be up to 3 MB');
  const data = await fileToDataUrl(file);
  const { url } = await api('/upload', { method: 'POST', body: { name: file.name, data } });
  return url;
}
