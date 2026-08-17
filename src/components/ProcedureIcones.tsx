/**
 * Pictogrammes de la procédure d’exportation — SVG maison, tracés au trait.
 * Aucune dépendance externe : la page source utilisait une police d’icônes
 * chargée depuis un CDN, incompatible avec le site.
 */

import type { IconeId } from '@/content/procedure-export';

const TRACES: Record<IconeId, React.ReactNode> = {
  // Épi de blé — production agricole
  ble: (
    <>
      <path d="M12 21V9" />
      <path d="M12 12.5c-.2-2 .9-3.6 2.9-4.2.3 2.1-.8 3.7-2.9 4.2Z" />
      <path d="M12 12.5c.2-2-.9-3.6-2.9-4.2-.3 2.1.8 3.7 2.9 4.2Z" />
      <path d="M12 8c-.2-2 .9-3.6 2.9-4.2.3 2.1-.8 3.7-2.9 4.2Z" />
      <path d="M12 8c.2-2-.9-3.6-2.9-4.2C8.8 5.9 9.9 7.5 12 8Z" />
      <path d="M12 17c-.2-2 .9-3.6 2.9-4.2.3 2.1-.8 3.7-2.9 4.2Z" />
      <path d="M12 17c.2-2-.9-3.6-2.9-4.2-.3 2.1.8 3.7 2.9 4.2Z" />
    </>
  ),
  // Microscope — analyses et contrôle qualité
  microscope: (
    <>
      <path d="M6 21h13" />
      <path d="M9 21a6 6 0 0 0 7-9.4" />
      <path d="m13 4 4 4-2.8 2.8-4-4Z" />
      <path d="m10.2 6.8-1.6 1.6" />
      <path d="M7 21h1.5" />
      <path d="M8 17h4" />
    </>
  ),
  // Carton — conditionnement et emballage
  carton: (
    <>
      <path d="M3 8.2 12 4l9 4.2v7.6L12 20l-9-4.2Z" />
      <path d="M3 8.2 12 12.4l9-4.2" />
      <path d="M12 12.4V20" />
    </>
  ),
  // Document — dossier commercial et documentaire
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </>
  ),
  // Camion — transit et pré-acheminement
  camion: (
    <>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h3.4l2.6 3.2V16h-6z" />
      <circle cx="7.5" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M9.5 18h5.5" />
    </>
  ),
  // Bâtiment à colonnes — administration douanière
  colonnes: (
    <>
      <path d="M3 10 12 4.5 21 10" />
      <path d="M5.5 10.5v7.5" />
      <path d="M9.8 10.5v7.5" />
      <path d="M14.2 10.5v7.5" />
      <path d="M18.5 10.5v7.5" />
      <path d="M3 20.5h18" />
    </>
  ),
  // Navire — expédition internationale
  navire: (
    <>
      <path d="M4.5 13.5h15L17 18.5H7z" />
      <path d="M12 13.5V5.5" />
      <path d="M12 6h4.5L12 9" />
      <path d="M3 21c1.5 0 1.5-1.2 3-1.2S7.5 21 9 21s1.5-1.2 3-1.2S13.5 21 15 21s1.5-1.2 3-1.2S19.5 21 21 21" />
    </>
  ),
  // Passeport — formalités et franchissement de frontière
  passeport: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9.5 17h5" />
    </>
  ),
  // Devanture — acheteur final et distribution
  boutique: (
    <>
      <path d="M4.5 9.5V20h15V9.5" />
      <path d="M3 9.5 5 4h14l2 5.5" />
      <path d="M9.5 20v-6h5v6" />
      <path d="M3 9.5h18" />
    </>
  ),
  // Bouclier — autorité de contrôle
  bouclier: (
    <>
      <path d="M12 3.5 5.5 6v6c0 4 2.8 6.9 6.5 8.5 3.7-1.6 6.5-4.5 6.5-8.5V6Z" />
      <path d="m9.3 11.8 2 2 3.4-3.6" />
    </>
  ),
};

export function ProcedureIcone({
  nom,
  taille = 20,
  className,
}: {
  nom: IconeId;
  taille?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {TRACES[nom]}
    </svg>
  );
}
