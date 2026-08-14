import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Racine explicite : évite l'imbrication du build standalone quand plusieurs
  // lockfiles existent dans les dossiers parents.
  outputFileTracingRoot: path.join(__dirname),
  // Le portail est mono-locale (/portail). On renvoie la variante /en/portail
  // (générée par le sélecteur de langue) vers /portail.
  async redirects() {
    return [
      {
        source: "/en/portail/:path*",
        destination: "/portail/:path*",
        permanent: false,
      },
      {
        source: "/en/portail",
        destination: "/portail",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
