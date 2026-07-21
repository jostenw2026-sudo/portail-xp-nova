import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Racine explicite : évite l'imbrication du build standalone quand plusieurs
  // lockfiles existent dans les dossiers parents.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
