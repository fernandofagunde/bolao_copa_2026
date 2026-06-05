import Link from "next/link";

import { deleteBet } from "@/app/actions";
import { isAuthenticated } from "@/lib/auth";
import { readLocalBets } from "@/lib/local-bets";
import { BET_AMOUNT_CENTS, formatBRLFromCents } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { findWorldCupTeam, getTeamDisplayName, WORLD_CUP_TEAMS } from "@/lib/world-cup-teams";

export const dynamic = "force-dynamic";

type BetView = {
  id: string;
  bettorName: string;
  teamName: string;
  teamDisplayName: string;
  teamGroup: string | null;
  amountCents: number;
  createdAt: Date | string;
};

type TeamCountView = {
  id: string;
  name: string;
  displayName: string;
  group: string | null;
  count: number;
};

type SearchParams = Promise<{ erro?: string }>;

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { erro } = await searchParams;
  const loggedIn = await isAuthenticated();
  let shouldReadLocalBets = !process.env.DATABASE_URL;
  let bets: BetView[] = [];
  let teamsWithBets: TeamCountView[] = WORLD_CUP_TEAMS.map((team) => ({
    id: team.name,
    name: team.name,
    displayName: getTeamDisplayName(team.name),
    group: team.group,
    count: 0,
  }));

  if (process.env.DATABASE_URL) {
    try {
      const [dbBets, dbTeamsWithBets] = await Promise.all([
        prisma.bet.findMany({
          include: { team: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.team.findMany({
          include: { _count: { select: { bets: true } } },
          orderBy: [{ group: "asc" }, { name: "asc" }],
        }),
      ]);

      bets = dbBets.map((bet) => ({
        id: bet.id,
        bettorName: bet.bettorName,
        teamName: bet.team.name,
        teamDisplayName: getTeamDisplayName(bet.team.name),
        teamGroup: bet.team.group,
        amountCents: bet.amountCents,
        createdAt: bet.createdAt,
      }));

      teamsWithBets = dbTeamsWithBets.map((team) => ({
        id: team.id,
        name: team.name,
        displayName: getTeamDisplayName(team.name),
        group: team.group,
        count: team._count.bets,
      }));
    } catch {
      bets = [];
      shouldReadLocalBets = true;
    }
  }

  if (shouldReadLocalBets) {
    const localBets = await readLocalBets();
    bets = localBets.map((bet) => {
      const team = findWorldCupTeam(bet.teamName);

      return {
        id: bet.id,
        bettorName: bet.bettorName,
        teamName: bet.teamName,
        teamDisplayName: getTeamDisplayName(bet.teamName),
        teamGroup: team?.group ?? null,
        amountCents: bet.amountCents,
        createdAt: bet.createdAt,
      };
    });

    teamsWithBets = WORLD_CUP_TEAMS.map((team) => ({
      id: team.name,
      name: team.name,
      displayName: getTeamDisplayName(team.name),
      group: team.group,
      count: localBets.filter((bet) => bet.teamName === team.name).length,
    }));
  }

  const total = bets.reduce((sum, bet) => sum + bet.amountCents, 0);
  const selectedTeams = teamsWithBets.filter((team) => team.count > 0);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.55fr_0.85fr] lg:px-8">
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-emerald-800">
              Valor fixo: {formatBRLFromCents(BET_AMOUNT_CENTS)}
            </p>
            <h1 className="mt-2 max-w-2xl text-4xl font-black tracking-normal text-stone-950 sm:text-5xl">
              Quem escolheu qual seleção
            </h1>
          </div>
          <Link
            href={loggedIn ? "/apostar" : "/login?next=/apostar"}
            className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-5 text-sm font-bold text-white hover:bg-stone-800"
          >
            Fazer aposta
          </Link>
        </div>

        {erro ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {erro}
          </div>
        ) : null}

        {!process.env.DATABASE_URL && process.env.NODE_ENV === "production" ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            Configure a DATABASE_URL do Neon na Vercel para salvar e apagar apostas em produção.
          </div>
        ) : null}

        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[1fr_1fr_120px_110px] border-b border-stone-200 bg-stone-50 px-5 py-3 text-xs font-black uppercase tracking-normal text-stone-500 sm:grid">
            <span>Pessoa</span>
            <span>Seleção</span>
            <span className="text-right">Valor</span>
            <span className="text-right">Ação</span>
          </div>
          {bets.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <p className="text-lg font-bold text-stone-950">Nenhuma aposta cadastrada ainda.</p>
              <p className="mt-2 text-sm text-stone-600">
                A primeira pessoa já pode escolher uma seleção.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {bets.map((bet) => (
                <li
                  key={bet.id}
                  className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_1fr_120px_110px] sm:items-center"
                >
                  <span className="font-bold text-stone-950">{bet.bettorName}</span>
                  <span className="text-stone-700">
                    {bet.teamDisplayName}
                    {bet.teamGroup ? (
                      <span className="ml-2 rounded bg-stone-100 px-2 py-1 text-xs font-bold text-stone-600">
                        Grupo {bet.teamGroup}
                      </span>
                    ) : null}
                  </span>
                  <span className="font-bold text-emerald-800 sm:text-right">
                    {formatBRLFromCents(bet.amountCents)}
                  </span>
                  <div className="sm:text-right">
                    {loggedIn ? (
                      <form action={deleteBet}>
                        <input type="hidden" name="betId" value={bet.id} />
                        <button
                          type="submit"
                          className="h-9 rounded-md border border-red-200 px-3 text-sm font-bold text-red-700 hover:bg-red-50"
                        >
                          Apagar
                        </button>
                      </form>
                    ) : (
                      <Link
                        href="/login?next=/"
                        className="inline-flex h-9 items-center rounded-md border border-red-200 px-3 text-sm font-bold text-red-700 hover:bg-red-50"
                      >
                        Apagar
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-normal text-stone-500">Total</p>
          <p className="mt-2 text-4xl font-black text-stone-950">{formatBRLFromCents(total)}</p>
          <p className="mt-1 text-sm text-stone-600">
            {bets.length} {bets.length === 1 ? "aposta" : "apostas"} cadastradas
          </p>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-stone-950">Seleções escolhidas</h2>
          <div className="mt-4 space-y-3">
            {selectedTeams.length === 0 ? (
              <p className="text-sm text-stone-600">Ainda sem seleções escolhidas.</p>
            ) : (
              selectedTeams.map((team) => (
                <div key={team.id} className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-stone-800">{team.displayName}</span>
                  <span className="rounded bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-800">
                    {team.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </main>
  );
}
