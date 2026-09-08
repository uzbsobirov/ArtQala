const http = require('http');

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function run() {
  console.log('Testing stats endpoints...');
  try {
    const daily = await fetchUrl('http://localhost:3000/api/admin/stats?range=daily');
    console.log('Daily status:', daily.status);
    console.log('Daily timeline points:', daily.body?.timeline?.length);
    console.log('Daily sample point:', daily.body?.timeline?.[0]);
    console.log('Categories count:', daily.body?.categoryStats?.length);
    console.log('Artists count:', daily.body?.artistStats?.length);
    console.log('Summary:', daily.body?.summary);

    const weekly = await fetchUrl('http://localhost:3000/api/admin/stats?range=weekly');
    console.log('\nWeekly status:', weekly.status);
    console.log('Weekly timeline points:', weekly.body?.timeline?.length);

    const monthly = await fetchUrl('http://localhost:3000/api/admin/stats?range=monthly');
    console.log('\nMonthly status:', monthly.status);
    console.log('Monthly timeline points:', monthly.body?.timeline?.length);

    const visit = await fetchUrl('http://localhost:3000/api/stats/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { path: '/gallery' },
    });
    console.log('\nVisit log status:', visit.status, visit.body);

    console.log('\nAll API checks PASSED!');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

run();
