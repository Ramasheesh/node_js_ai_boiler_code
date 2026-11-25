// Global test setup — runs before all test files
process.env['NODE_ENV'] = 'test';
process.env['DATABASE_URL'] =
  process.env['TEST_DATABASE_URL'] ||
  process.env['DATABASE_URL'] ||
  'postgresql://postgres:password@localhost:5432/boilerplate_test?schema=public';
process.env['JWT_ACCESS_SECRET'] = 'test-access-secret-min-32-chars-long-enough-here';
process.env['JWT_REFRESH_SECRET'] = 'test-refresh-secret-min-32-chars-long-enough-here';
process.env['PORT'] = '3001';
process.env['REDIS_ENABLED'] = 'false';
process.env['LOG_LEVEL'] = 'error'; // lowest valid level for quiet test output
process.env['CORS_ORIGIN'] = 'http://localhost:3001';
