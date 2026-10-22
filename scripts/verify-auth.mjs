// Start a production server with ADMIN_EMAIL/USER_EMAIL and matching password hashes.
// Supply test passwords via AUTH_TEST_ADMIN_PASSWORD / AUTH_TEST_USER_PASSWORD.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = process.env.AUTH_TEST_URL || 'http://localhost:3000';
const checks = [];
class Client {
  cookies = new Map();
  async request(path, options = {}) {
    const response = await fetch(base + path, { ...options, redirect: 'manual', headers: { cookie: [...this.cookies].map(([k,v]) => `${k}=${v}`).join('; '), ...options.headers } });
    for (const cookie of response.headers.getSetCookie()) { const pair = cookie.split(';')[0]; const index = pair.indexOf('='); this.cookies.set(pair.slice(0,index),pair.slice(index+1)); }
    return response;
  }
  async login(email,password) {
    const csrf = await (await this.request('/api/auth/csrf')).json();
    const response = await this.request('/api/auth/callback/credentials', { method:'POST', headers: { 'content-type':'application/x-www-form-urlencoded' }, body: new URLSearchParams({ csrfToken:csrf.csrfToken,email,password,json:'true',callbackUrl:base+'/dashboard' }) });
    return response.json();
  }
}
const anonymous = new Client();
for (const path of ['/admin','/admin/nested','/dashboard']) { const r = await anonymous.request(path); assert.equal(r.status,307); assert.match(r.headers.get('location'),/\/login/); }
checks.push('anonymous protected routes redirect to login');
const bad = new Client(); await bad.login('admin@example.com','incorrect-password'); assert.equal(await (await bad.request('/api/auth/session')).text(),'{}');
checks.push('invalid credentials rejected');
const user = new Client(); await user.login('user@example.com',process.env.AUTH_TEST_USER_PASSWORD); const userSession = await (await user.request('/api/auth/session')).json(); assert.equal(userSession.user.role,'user'); assert.equal(userSession.user.id,'local-user'); assert.equal((await user.request('/dashboard')).status,200); assert.match((await user.request('/admin')).headers.get('location'),/\/forbidden/);
checks.push('user session typed fields, dashboard allowed, admin denied');
const admin = new Client(); await admin.login('admin@example.com',process.env.AUTH_TEST_ADMIN_PASSWORD); assert.equal((await (await admin.request('/api/auth/session')).json()).user.role,'admin'); const adminPage = await (await admin.request('/admin')).text(); const actionName = adminPage.match(/name="(\$ACTION_ID_[^"]+)"/)[1];
checks.push('admin page allowed');
for (const [client,expected] of [[anonymous,'/login'],[user,'/forbidden'],[admin,'/admin?checked=1']]) {
  const body = new FormData(); body.set(actionName,'');
  // Replay a captured admin action as each role.
  const r = await client.request('/admin',{ method:'POST',headers:{ origin:base }, body });
  assert.equal(r.status,client === admin ? 303 : 307); assert.ok(r.headers.get('location').includes(expected));
}
checks.push('captured admin Server Action rejects anonymous/user; admin succeeds');
const tampered = new Client(); tampered.cookies.set('next-auth.session-token','forged-admin-token'); assert.match((await tampered.request('/admin')).headers.get('location'),/\/login/);
checks.push('forged JWT rejected');
for (const [path,image] of [['/','/opengraph-image'],['/about','/about/opengraph-image']]) {
  const html = await (await anonymous.request(path)).text(); assert.ok(html.includes(`rel="canonical" href="${base}${path === '/' ? '' : path}"`)); assert.match(html,/property="og:image"/); assert.match(html,/application\/ld\+json/);
  const r = await anonymous.request(image); assert.equal(r.status,200); assert.match(r.headers.get('content-type'),/image\/png/);
}
checks.push('both public pages: canonical, Open Graph, JSON-LD, generated image');
const csrf = await (await admin.request('/api/auth/csrf')).json(); await admin.request('/api/auth/signout',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({csrfToken:csrf.csrfToken,json:'true'})}); assert.equal(await (await admin.request('/api/auth/session')).text(),'{}');
checks.push('signout clears session');
fs.mkdirSync('reports/testing',{recursive:true}); fs.writeFileSync('reports/testing/next-auth-results.json',JSON.stringify({time:new Date().toISOString(),checks,oauth:'Not exercised: requires GitHub client credentials'},null,2)); console.log(checks);
