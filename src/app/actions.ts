"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  clearAuthCookie,
  isAuthenticated,
  sanitizeNextPath,
  setAuthCookie,
} from "@/lib/auth";
import { deleteLocalBet, upsertLocalBet } from "@/lib/local-bets";
import { BET_AMOUNT_CENTS } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { findWorldCupTeam, toPrismaTeamInput } from "@/lib/world-cup-teams";

const betSchema = z.object({
  bettorName: z
    .string()
    .trim()
    .min(2, "Digite um nome com pelo menos 2 caracteres.")
    .max(80, "Use um nome com no maximo 80 caracteres."),
  teamName: z.string().trim().min(1, "Selecione uma seleção válida."),
});

const loginSchema = z.object({
  username: z.string().trim(),
  password: z.string(),
  next: z.string().optional(),
});

function canUseLocalStorageFallback() {
  return process.env.NODE_ENV !== "production";
}

function databaseRequiredRedirect(path: "/" | "/apostar") {
  const message = "Configure a DATABASE_URL do Neon na Vercel para salvar e apagar apostas.";
  redirect(`${path}?erro=${encodeURIComponent(message)}`);
}

export async function createBet(formData: FormData) {
  if (!(await isAuthenticated())) {
    redirect("/login?next=/apostar");
  }

  const parsed = betSchema.safeParse({
    bettorName: formData.get("bettorName"),
    teamName: formData.get("teamName"),
  });

  if (!parsed.success) {
    redirect(`/apostar?erro=${encodeURIComponent(parsed.error.errors[0].message)}`);
  }

  const { bettorName, teamName } = parsed.data;
  const selectedTeam = findWorldCupTeam(teamName);

  if (!selectedTeam) {
    redirect("/apostar?erro=Seleção não encontrada.");
  }

  if (!process.env.DATABASE_URL) {
    if (!canUseLocalStorageFallback()) {
      databaseRequiredRedirect("/apostar");
    }

    try {
      await upsertLocalBet({ bettorName, teamName });
    } catch {
      redirect("/apostar?erro=Não foi possível salvar a aposta localmente.");
    }

    revalidatePath("/");
    revalidatePath("/apostar");
    redirect("/");
  }

  try {
    const teamData = toPrismaTeamInput(selectedTeam);
    const team = await prisma.team.upsert({
      where: { name: selectedTeam.name },
      create: teamData,
      update: teamData,
    });

    await prisma.bet.upsert({
      where: { bettorName },
      create: {
        bettorName,
        teamId: team.id,
        amountCents: BET_AMOUNT_CENTS,
      },
      update: {
        teamId: team.id,
        amountCents: BET_AMOUNT_CENTS,
      },
    });
  } catch {
    if (!canUseLocalStorageFallback()) {
      redirect("/apostar?erro=Não foi possível salvar no banco de dados.");
    }

    try {
      await upsertLocalBet({ bettorName, teamName });
    } catch {
      redirect("/apostar?erro=Não foi possível salvar a aposta localmente.");
    }
  }

  revalidatePath("/");
  revalidatePath("/apostar");
  redirect("/");
}

export async function deleteBet(formData: FormData) {
  if (!(await isAuthenticated())) {
    redirect("/login?next=/");
  }

  const betId = formData.get("betId");

  if (typeof betId !== "string" || betId.length === 0) {
    redirect("/");
  }

  if (process.env.DATABASE_URL) {
    try {
      await prisma.bet.delete({ where: { id: betId } });
    } catch {
      if (!canUseLocalStorageFallback()) {
        redirect("/?erro=Não foi possível apagar no banco de dados.");
      }

      try {
        await deleteLocalBet(betId);
      } catch {
        redirect("/?erro=Não foi possível apagar a aposta localmente.");
      }
    }
  } else {
    if (!canUseLocalStorageFallback()) {
      databaseRequiredRedirect("/");
    }

    try {
      await deleteLocalBet(betId);
    } catch {
      redirect("/?erro=Não foi possível apagar a aposta localmente.");
    }
  }

  revalidatePath("/");
  redirect("/");
}

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    redirect("/login?erro=Informe usuario e senha.");
  }

  const next = sanitizeNextPath(parsed.data.next ?? "/");

  if (parsed.data.username !== "adm" || parsed.data.password !== "1234") {
    redirect(`/login?next=${encodeURIComponent(next)}&erro=Usuario ou senha invalidos.`);
  }

  await setAuthCookie();
  redirect(next);
}

export async function logout() {
  await clearAuthCookie();
  revalidatePath("/");
  redirect("/");
}
