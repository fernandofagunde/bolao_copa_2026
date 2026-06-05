import Link from "next/link";
import { redirect } from "next/navigation";

import { deleteBet } from "@/app/actions";
import { isAuthenticated } from "@/lib/auth";
import { readLocalBets } from "@/lib/local-bets";
import { formatBRLFromCents } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { findWorldCupTeam, getTeamDisplayName } from "@/lib/world-cup-teams";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ betId?: string }>;

type DeleteBetView = {
  id: string;
  bettorName: string;
  teamDisplayName: string;
  teamGroup: string | null;
  amountCents: number;
};

async function findBetForDelete(betId: string): Promise<DeleteBetView | null> {
  if (process.env.DATABASE_URL) {
    try {
      const bet = await prisma.bet.findUnique({
        where: { id: betId },
        include: { team: true },
      });

      if (!bet) {
        return null;
      }

      return {
        id: bet.id,
        bettorName: bet.bettorName,
        teamDisplayName: getTeamDisplayName(bet.team.name),
        teamGroup: bet.team.group,
        amountCents: bet.amountCents,
      };
    } catch {
      return null;
    }
  }

  const localBet = (await readLocalBets()).find((bet) => bet.id === betId);

  if (!localBet) {
    return null;
  }

  const team = findWorldCupTeam(localBet.teamName);

  return {
    id: localBet.id,
    bettorName: localBet.bettorName,
    teamDisplayName: getTeamDisplayName(localBet.teamName),
    teamGroup: team?.group ?? null,
    amountCents: localBet.amountCents,
  };
}

export default async function DeleteBetPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { betId } = await searchParams;

  if (!betId) {
    redirect("/");
  }

  if (!(await isAuthenticated())) {
    redirect(`/login?next=${encodeURIComponent(`/apagar?betId=${betId}`)}&force=1`);
  }

  const bet = await findBetForDelete(betId);

  if (!bet) {
    redirect("/?erro=Aposta não encontrada.");
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-normal text-red-700">
          Confirmação
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-normal text-stone-950 sm:text-5xl">
          Apagar aposta
        </h1>
        <p className="mt-3 text-base text-stone-700">
          Confira os dados antes de apagar.
        </p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <dl className="grid gap-4 text-sm">
          <div>
            <dt className="font-bold text-stone-500">Pessoa</dt>
            <dd className="mt-1 text-lg font-black text-stone-950">{bet.bettorName}</dd>
          </div>
          <div>
            <dt className="font-bold text-stone-500">Seleção</dt>
            <dd className="mt-1 text-lg font-black text-stone-950">
              {bet.teamDisplayName}
              {bet.teamGroup ? (
                <span className="ml-2 rounded bg-stone-100 px-2 py-1 text-xs font-bold text-stone-600">
                  Grupo {bet.teamGroup}
                </span>
              ) : null}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-stone-500">Valor</dt>
            <dd className="mt-1 text-lg font-black text-emerald-800">
              {formatBRLFromCents(bet.amountCents)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <form action={deleteBet} className="flex-1">
            <input type="hidden" name="betId" value={bet.id} />
            <button
              type="submit"
              className="h-12 w-full rounded-md bg-red-700 px-5 text-sm font-black text-white hover:bg-red-800"
            >
              Confirmar exclusão
            </button>
          </form>
          <Link
            href="/"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-md border border-stone-300 px-5 text-sm font-black text-stone-800 hover:bg-stone-50"
          >
            Cancelar
          </Link>
        </div>
      </div>
    </main>
  );
}
