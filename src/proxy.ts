import { NextRequest, NextResponse } from "next/server";

// Protection du chantier (bingeco.xp-nova.com) par Basic Auth.
// Activée seulement si CHANTIER_PROTECT === "on" (désactivée sur localhost par défaut).
// À la mise en production sur xp-nova.com : ne pas activer.

const USER = process.env.CHANTIER_USER ?? "xpnova";
const PASS = process.env.CHANTIER_PASS ?? "";
const PROTECT = process.env.CHANTIER_PROTECT === "on";

export function proxy(req: NextRequest) {
  if (!PROTECT) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (auth) {
    const [, encoded] = auth.split(" ");
    const [user, pass] = atob(encoded).split(":");
    if (user === USER && pass === PASS) return NextResponse.next();
  }
  return new NextResponse("Accès restreint — chantier XP-NOVA", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="XP-NOVA — chantier"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.svg|brand|fonts).*)"],
};
