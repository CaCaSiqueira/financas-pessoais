/** Regras puras de sessão e redirecionamento (sem I/O — testáveis isoladamente). */

export const LOGIN_PATH = "/login";
export const DEFAULT_AUTHENTICATED_PATH = "/dashboard";

/** Rotas acessíveis sem sessão. Todo o resto exige login. */
const PUBLIC_PATHS = [LOGIN_PATH, "/auth/callback", "/auth/auth-code-error"] as const;

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function isProtectedPath(pathname: string): boolean {
  return !isPublicPath(pathname);
}

/**
 * Normaliza o destino pós-login para um caminho interno. Bloqueia open redirect
 * (URLs absolutas, `//host`, `/\host`, esquemas) e volta ao padrão quando inválido.
 */
export function getSafeRedirectPath(next: string | null | undefined): string {
  if (!next || typeof next !== "string") return DEFAULT_AUTHENTICATED_PATH;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return DEFAULT_AUTHENTICATED_PATH;
  }
  if (/[\u0000-\u001f]/.test(next)) return DEFAULT_AUTHENTICATED_PATH;

  try {
    const url = new URL(next, "http://localhost");
    if (url.origin !== "http://localhost") return DEFAULT_AUTHENTICATED_PATH;
    if (isPublicPath(url.pathname)) return DEFAULT_AUTHENTICATED_PATH;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_AUTHENTICATED_PATH;
  }
}

/** Monta `/login?next=...` preservando o destino original quando ele é útil. */
export function buildLoginRedirectPath(pathname: string, search = ""): string {
  const target = `${pathname}${search}`;
  if (pathname === "/" || isPublicPath(pathname)) return LOGIN_PATH;
  const safe = getSafeRedirectPath(target);
  return `${LOGIN_PATH}?next=${encodeURIComponent(safe)}`;
}

export type SessionDecision = { action: "next" } | { action: "redirect"; to: string };

/** Decide o que o proxy faz com a requisição, dado se há usuário autenticado. */
export function decideSessionRoute(
  pathname: string,
  search: string,
  isAuthenticated: boolean,
): SessionDecision {
  if (isAuthenticated) {
    if (pathname === LOGIN_PATH || pathname === "/") {
      return { action: "redirect", to: DEFAULT_AUTHENTICATED_PATH };
    }
    return { action: "next" };
  }
  if (isPublicPath(pathname)) return { action: "next" };
  return { action: "redirect", to: buildLoginRedirectPath(pathname, search) };
}
