import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Test user ID (you'll need to replace this with a real Clerk user ID)
  const testUserId = "user_test";

  // Create test pages
  const page1 = await prisma.page.create({
    data: {
      title: "Welcome to Notion Clone",
      content: "This is your first page. Start writing and organizing!",
      userId: testUserId,
    },
  });

  const page2 = await prisma.page.create({
    data: {
      title: "Getting Started Guide",
      content: "Here's how to use the main features:\n\n1. Create pages\n2. Edit content\n3. Manage versions\n4. Archive and restore",
      userId: testUserId,
    },
  });

  // Create a version for page1
  await prisma.pageVersion.create({
    data: {
      title: page1.title,
      content: page1.content,
      pageId: page1.id,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 