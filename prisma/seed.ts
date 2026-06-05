import { PrismaClient } from "@prisma/client";

import { toPrismaTeamInput, WORLD_CUP_TEAMS } from "../src/lib/world-cup-teams";

const prisma = new PrismaClient();

async function main() {
  for (const team of WORLD_CUP_TEAMS) {
    const data = toPrismaTeamInput(team);

    await prisma.team.upsert({
      where: { name: team.name },
      create: data,
      update: data,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
