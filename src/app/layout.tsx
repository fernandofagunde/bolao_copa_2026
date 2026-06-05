import type { Metadata } from "next";
import Link from "next/link";

import { logout } from "@/app/actions";
import { isAuthenticated } from "@/lib/auth";

import "./globals.css";

export const metadata: Metadata = {
  title: "Bolão do Ciço Copa do Mundo 2026:",
  description: "Bolão simples para apostas da Copa do Mundo 2026.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await isAuthenticated();

  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-stone-200 bg-white/82 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="text-lg font-black tracking-normal text-stone-950">
                Bolão do Ciço Copa do Mundo 2026:
              </Link>
              <nav className="flex items-center gap-2 text-sm font-semibold">
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-950"
                >
                  Apostas
                </Link>
                <Link
                  href={loggedIn ? "/apostar" : "/login?next=/apostar"}
                  className="rounded-md bg-emerald-700 px-3 py-2 text-white hover:bg-emerald-800"
                >
                  Apostar
                </Link>
                {loggedIn ? (
                  <form action={logout}>
                    <button
                      type="submit"
                      className="rounded-md px-3 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-950"
                    >
                      Sair
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/login"
                    className="rounded-md px-3 py-2 text-stone-700 hover:bg-stone-100 hover:text-stone-950"
                  >
                    Login
                  </Link>
                )}
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
