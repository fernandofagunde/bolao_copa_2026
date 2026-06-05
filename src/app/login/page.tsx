import { redirect } from "next/navigation";

import { login } from "@/app/actions";
import { isAuthenticated, sanitizeNextPath } from "@/lib/auth";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ erro?: string; force?: string; next?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { erro, force, next } = await searchParams;
  const nextPath = sanitizeNextPath(next ?? "/apostar");
  const forceLogin = force === "1";

  if (!forceLogin && (await isAuthenticated())) {
    redirect(nextPath);
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-800">
          Acesso restrito
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-normal text-stone-950 sm:text-5xl">
          Login
        </h1>
        <p className="mt-3 text-base text-stone-700">
          Entre para fazer ou apagar apostas.
        </p>
      </div>

      <form action={login} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        {erro ? (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {erro}
          </div>
        ) : null}

        <input type="hidden" name="next" value={nextPath} />

        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-stone-800">Usuário</span>
            <input
              name="username"
              required
              autoComplete="username"
              className="h-12 rounded-md border border-stone-300 bg-white px-4 text-stone-950 outline-none ring-emerald-700/20 transition focus:border-emerald-700 focus:ring-4"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-stone-800">Senha</span>
            <input
              name="password"
              required
              type="password"
              autoComplete="current-password"
              className="h-12 rounded-md border border-stone-300 bg-white px-4 text-stone-950 outline-none ring-emerald-700/20 transition focus:border-emerald-700 focus:ring-4"
            />
          </label>

          <button
            type="submit"
            className="h-12 rounded-md bg-emerald-700 px-5 text-sm font-black text-white hover:bg-emerald-800"
          >
            Entrar
          </button>
        </div>
      </form>
    </main>
  );
}
