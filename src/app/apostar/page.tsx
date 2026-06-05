import { createBet } from "@/app/actions";
import { isAuthenticated } from "@/lib/auth";
import { formatBRLFromCents, BET_AMOUNT_CENTS } from "@/lib/money";
import { getTeamOptionLabel, WORLD_CUP_TEAMS } from "@/lib/world-cup-teams";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ erro?: string }>;

export default async function BetPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (!(await isAuthenticated())) {
    redirect("/login?next=/apostar");
  }

  const { erro } = await searchParams;
  const teams = [...WORLD_CUP_TEAMS].sort((a, b) => {
    const groupComparison = a.group.localeCompare(b.group);
    return groupComparison || a.namePt.localeCompare(b.namePt, "pt-BR");
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-800">
          Área protegida
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-normal text-stone-950 sm:text-5xl">
          Fazer ou atualizar aposta
        </h1>
        <p className="mt-3 max-w-2xl text-base text-stone-700">
          Digite seu nome e escolha uma seleção. Se o nome ja existir, a escolha anterior sera
          atualizada.
        </p>
      </div>

      <form action={createBet} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        {erro ? (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {erro}
          </div>
        ) : null}

        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-stone-800">Nome da pessoa</span>
            <input
              name="bettorName"
              required
              minLength={2}
              maxLength={80}
              placeholder="Ex.: Fernando"
              className="h-12 rounded-md border border-stone-300 bg-white px-4 text-stone-950 outline-none ring-emerald-700/20 transition focus:border-emerald-700 focus:ring-4"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-stone-800">Seleção</span>
            <select
              name="teamName"
              required
              className="h-12 rounded-md border border-stone-300 bg-white px-4 text-stone-950 outline-none ring-emerald-700/20 transition focus:border-emerald-700 focus:ring-4"
              defaultValue=""
            >
              <option value="" disabled>
                Selecione uma seleção da Copa 2026
              </option>
              {teams.map((team) => (
                <option key={team.name} value={team.name}>
                  {getTeamOptionLabel(team)}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-3 rounded-md bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-semibold text-stone-700">Valor fixo da aposta</span>
            <span className="text-xl font-black text-stone-950">
              {formatBRLFromCents(BET_AMOUNT_CENTS)}
            </span>
          </div>

          <button
            type="submit"
            className="h-12 rounded-md bg-emerald-700 px-5 text-sm font-black text-white hover:bg-emerald-800"
          >
            Salvar aposta
          </button>
        </div>
      </form>
    </main>
  );
}
