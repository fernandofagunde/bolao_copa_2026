import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { BET_AMOUNT_CENTS } from "@/lib/money";

export type LocalBet = {
  id: string;
  bettorName: string;
  teamName: string;
  amountCents: number;
  createdAt: string;
  updatedAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const betsPath = path.join(dataDir, "local-bets.json");

export async function readLocalBets(): Promise<LocalBet[]> {
  try {
    const content = await readFile(betsPath, "utf-8");
    return JSON.parse(content) as LocalBet[];
  } catch {
    return [];
  }
}

export async function upsertLocalBet(input: { bettorName: string; teamName: string }) {
  const bets = await readLocalBets();
  const now = new Date().toISOString();
  const existingBet = bets.find(
    (bet) => bet.bettorName.toLowerCase() === input.bettorName.toLowerCase(),
  );

  if (existingBet) {
    existingBet.bettorName = input.bettorName;
    existingBet.teamName = input.teamName;
    existingBet.amountCents = BET_AMOUNT_CENTS;
    existingBet.updatedAt = now;
  } else {
    bets.unshift({
      id: randomUUID(),
      bettorName: input.bettorName,
      teamName: input.teamName,
      amountCents: BET_AMOUNT_CENTS,
      createdAt: now,
      updatedAt: now,
    });
  }

  await mkdir(dataDir, { recursive: true });
  await writeFile(betsPath, JSON.stringify(bets, null, 2));
}

export async function deleteLocalBet(id: string) {
  const bets = await readLocalBets();
  const nextBets = bets.filter((bet) => bet.id !== id);

  await mkdir(dataDir, { recursive: true });
  await writeFile(betsPath, JSON.stringify(nextBets, null, 2));
}
