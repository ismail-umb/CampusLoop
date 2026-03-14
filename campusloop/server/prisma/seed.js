import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("AdminPass123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@umb.edu" },
    update: {},
    create: {
      email: "admin@umb.edu",
      passwordHash,
      firstName: "Campus",
      lastName: "Admin",
      role: "ADMIN",
      isVerified: true
    }
  });

  console.log("Seed complete. Admin login: admin@umb.edu / AdminPass123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });