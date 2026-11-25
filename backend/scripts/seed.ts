import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function seed(): Promise<void> {
  console.log('🌱 Seeding database...');

  const adminPassword = await argon2.hash('Admin@123456', {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          bio: 'System administrator',
        },
      },
    },
    select: { id: true, email: true, role: true },
  });

  console.log('✅ Admin user:', admin.email);

  const userPassword = await argon2.hash('User@123456', {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      username: 'testuser',
      password: userPassword,
      role: 'USER',
    },
    select: { id: true, email: true, role: true },
  });

  console.log('✅ Test user:', user.email);
  console.log('');
  console.log('🎉 Seed complete!');
  console.log('   Admin → admin@example.com / Admin@123456');
  console.log('   User  → user@example.com  / User@123456');
}

seed()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
