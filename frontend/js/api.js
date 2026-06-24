// Sanskriti Market — API client
const API = (() => {
  const BASE = '';

  const request = async (method, path, data = null) => {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    };
    const token = localStorage.getItem('sm_token');
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    if (data) opts.body = JSON.stringify(data);

    const res = await fetch(BASE + path, opts);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(json.message || 'Request failed'), { status: res.status, data: json });
    return json;
  };

  return {
    get: (path) => request('GET', path),
    post: (path, data) => request('POST', path, data),
    put: (path, data) => request('PUT', path, data),
    patch: (path, data) => request('PATCH', path, data),
    delete: (path) => request('DELETE', path),
  };
})();
