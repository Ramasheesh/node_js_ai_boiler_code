import { execSync } from 'child_process';

const command =
  process.env['NODE_ENV'] === 'production'
    ? 'npx prisma migrate deploy'
    : 'npx prisma migrate dev';

try {
  console.log(`Running: ${command}`);
  execSync(command, { stdio: 'inherit' });
  console.log('✅ Migration complete');
} catch (err) {
  console.error('❌ Migration failed:', err);
  process.exit(1);
}
