import { verifySession } from "@/lib/portal/dal";
import { PortalChrome, RoleDashboard } from "@/components/portal/PortalUI";

// Toujours dynamique : dépend de la session (cookie), jamais mis en cache statiquement.
export const dynamic = "force-dynamic";

export default async function PortailPage() {
  const session = await verifySession(); // redirige vers /portail/login si absent

  return (
    <>
      <PortalChrome session={session} />
      <RoleDashboard session={session} />
    </>
  );
}
