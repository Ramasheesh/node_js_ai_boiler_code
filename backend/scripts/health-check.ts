import http from 'http';

const PORT = process.env['PORT'] ?? '3000';
const API_VERSION = process.env['API_VERSION'] ?? 'v1';

function check(): void {
  const req = http.get(
    `http://localhost:${PORT}/api/${API_VERSION}/health/live`,
    (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Server is healthy');
        process.exit(0);
      } else {
        console.error(`❌ Health check failed: HTTP ${res.statusCode}`);
        process.exit(1);
      }
    },
  );

  req.on('error', (err) => {
    console.error('❌ Health check error:', err.message);
    process.exit(1);
  });

  req.setTimeout(5000, () => {
    console.error('❌ Health check timed out');
    req.destroy();
    process.exit(1);
  });
}

check();
