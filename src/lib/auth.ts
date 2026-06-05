import { cookies } from "next/headers";

export const AUTH_COOKIE = "bolao_auth";
const AUTH_COOKIE_VALUE = "adm";

export async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value === AUTH_COOKIE_VALUE;
}

export async function setAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, AUTH_COOKIE_VALUE, {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "lax",
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export function sanitizeNextPath(value: FormDataEntryValue | string | null) {
  const next = typeof value === "string" ? value : "/";

  if (!next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }

  return next;
}
