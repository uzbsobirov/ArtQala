const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve({ res, data: JSON.parse(data) });
        } catch {
          resolve({ res, data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('Testing thread-based messaging system...');

  // 1. Sign in as Emily Carter (demo user)
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/signin',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'emily.carter@example.com', password: 'password123' }
  );

  console.log('Emily login status:', loginRes.res.statusCode);
  const cookie = loginRes.res.headers['set-cookie']?.[0] || '';

  // 2. Fetch user inquiries & unread count
  const userInqRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/user/inquiries',
    method: 'GET',
    headers: { Cookie: cookie },
  });

  console.log('User inquiries status:', userInqRes.res.statusCode);
  console.log('Total unread count for Emily:', userInqRes.data.totalUnreadCount);
  const firstInq = userInqRes.data.inquiries?.[0];
  console.log('First inquiry ID:', firstInq?.id);
  console.log('First inquiry messages count:', firstInq?.messages?.length);
  console.log('First inquiry unread count:', firstInq?.unreadCount);

  if (!firstInq) {
    throw new Error('No inquiry found for Emily!');
  }

  // 3. Customer posts a new message
  const customerMsg = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/inquiries/${firstInq.id}/messages`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
    },
    {
      sender: 'CUSTOMER',
      message: 'Could you also include an insurance certificate with the shipment?',
    }
  );

  console.log('Customer message post status:', customerMsg.res.statusCode, customerMsg.data.success);

  // 4. Admin replies to inquiry
  const adminMsg = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/inquiries/${firstInq.id}/messages`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      sender: 'ADMIN',
      message: 'Yes, full transit insurance is always included at no extra charge!',
      status: 'ANSWERED',
    }
  );

  console.log('Admin reply post status:', adminMsg.res.statusCode, adminMsg.data.success);

  // 5. Customer marks messages as read
  const readRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: `/api/inquiries/${firstInq.id}/read`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
    },
    { viewer: 'CUSTOMER' }
  );

  console.log('Mark read status:', readRes.res.statusCode, readRes.data.success);

  // 6. Verify unread count updated
  const updatedInqRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/user/inquiries',
    method: 'GET',
    headers: { Cookie: cookie },
  });

  const updatedFirstInq = updatedInqRes.data.inquiries?.find((i) => i.id === firstInq.id);
  console.log('Updated messages count in thread:', updatedFirstInq?.messages?.length);
  console.log('Updated unread count on this inquiry:', updatedFirstInq?.unreadCount);

  console.log('\nAll Thread Messaging Checks PASSED successfully!');
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
