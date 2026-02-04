// Run this script to reset admin: node scripts/reset-admin.js
const https = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/reset',
  method: 'DELETE',
  headers: {
    'x-reset-key': 'RESET_ADMIN_2024'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    if (res.statusCode === 200) {
      console.log('\n✅ Admin deleted successfully!');
      console.log('Now go to http://localhost:3000/admin/setup to create a new admin.');
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
  console.log('Make sure the dev server is running: npm run dev');
});

req.end();
