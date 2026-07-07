const jwt = require('jsonwebtoken');
const http = require('http');

const token = jwt.sign({ userId: 'test-user', name: 'Teacher', role: 'teacher' }, 'aclc_secret_jwt_key_123456');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/post-class-diary',
  method: 'GET',
  headers: {
    'Cookie': `khoahoc5_auth_token=${token}`
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("Status:", res.statusCode);
    console.log("Response:", data.substring(0, 1000));
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});
req.end();
