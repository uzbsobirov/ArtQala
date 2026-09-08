const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ res, data }));
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

async function test() {
  // 1. Sign in as admin
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/signin',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@artqala.uz', password: 'admin123' }
  );

  console.log('Login status:', loginRes.res.statusCode);
  const cookie = loginRes.res.headers['set-cookie'];
  console.log('Set-Cookie received:', Boolean(cookie));

  // 2. Request /admin with cookie
  const adminRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/admin',
    method: 'GET',
    headers: {
      Cookie: cookie ? cookie[0] : '',
    },
  });

  console.log('/admin response status:', adminRes.res.statusCode);
  console.log('/admin HTML output contains Recharts or Dashboard:');
  console.log('Has "Revenue & Traffic Dynamics" or similar:', adminRes.data.includes('Dynamics') || adminRes.data.includes('dinamikasi') || adminRes.data.includes('AdminDashboardClient') || adminRes.data.includes('overviewDynamics'));
  console.log('Admin page rendered successfully with length:', adminRes.data.length);
}

test();
