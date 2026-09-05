const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });
async function run() {
  try {
    const user = await prisma.user.findFirst();
    console.log("Success:", user);
  } catch (e) {
    console.error(e.message);
  }
}
run();
