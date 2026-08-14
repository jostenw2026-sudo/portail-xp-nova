import { redirect } from "next/navigation";
import { getOptionalSession } from "@/lib/portal/dal";

export const dynamic = "force-dynamic";

const errorMessages: Record<string, string> = {
  config: "Le portail n'est pas encore configuré (paramètres OIDC manquants).",
  params: "Réponse d'authentification incomplète. Réessayez.",
  state: "Session d'authentification expirée ou invalide. Réessayez.",
  oidc: "Authentification refusée par le fournisseur d'identité.",
  exchange: "Impossible de valider la connexion. Réessayez.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; msg?: string }>;
}) {
  const session = await getOptionalSession();
  if (session?.sub) redirect("/portail");

  const { error } = await searchParams;
  const message = error ? (errorMessages[error] ?? "Erreur de connexion.") : null;

  return (
    <div className="container-x flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-xl border border-line bg-paper p-8 shadow-sm">
        <p className="eyebrow mb-3">Espace sécurisé</p>
        <h1 className="font-display text-2xl text-navy">Portail XP-NOVA</h1>
        <p className="mt-2 text-grey">
          Accès réservé aux clients, experts et fournisseurs. Connectez-vous avec votre
          compte XP-NOVA (SSO sécurisé).
        </p>

        {message && (
          <div className="mt-4 rounded-md border border-gold/40 bg-gold/10 p-3 text-sm text-navy">
            {message}
          </div>
        )}

        <a
          href="/api/auth/login"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 font-semibold text-navy no-underline transition-colors hover:bg-gold-soft"
        >
          Se connecter avec XP-NOVA
        </a>

        <p className="mt-4 text-center text-xs text-grey">
          Authentification unique &amp; MFA via Authentik · auth.xp-nova.com
        </p>
      </div>
    </div>
  );
}
