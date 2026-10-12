import fs from 'node:fs';
const base = '/srv/mzsh-umami/config';
const url = process.argv[2] || 'http://127.0.0.1:3000';
async function request(route, options = {}) {
  const response = await fetch(url + route, {...options, signal: AbortSignal.timeout(10000)});
  if (!response.ok) throw new Error(`Verification HTTP ${response.status} at ${route}`);
  return response.json();
}
const username = fs.readFileSync(`${base}/admin-username`, 'utf8').trim();
const password = fs.readFileSync(`${base}/admin-password`, 'utf8').trim();
const login = await request('/api/auth/login', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username,password})});
if (!login.token || !login.user?.id) throw new Error('Authentication response incomplete');
const websites = await request('/api/websites', {headers:{Authorization:`Bearer ${login.token}`}});
const list = websites.data ?? websites;
if (!Array.isArray(list) || list.length !== 1) throw new Error('Historical website unavailable');
await request(`/api/websites/${list[0].id}/stats?startAt=0&endAt=${Date.now()}`, {headers:{Authorization:`Bearer ${login.token}`}});
console.log('Authentication, historical website and database statistics verified');
