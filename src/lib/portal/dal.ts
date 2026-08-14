/**
 * Data Access Layer : point de contrôle central de l'authentification pour les
 * Server Components et Route Handlers. `verifySession()` redirige vers la page
 * de connexion si aucune session valide n'est présente.
 */
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession, type PortalSession } from "./session";

export const verifySession = cache(async (): Promise<PortalSession> => {
  const session = await getSession();
  if (!session?.sub) {
    redirect("/portail/login");
  }
  return session;
});

/** Variante sans redirection (retourne null si non connecté). */
export const getOptionalSession = cache(async (): Promise<PortalSession | null> => {
  return getSession();
});
