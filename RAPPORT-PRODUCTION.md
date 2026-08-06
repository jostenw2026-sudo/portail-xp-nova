# RAPPORT DE PRODUCTION — Site XP-NOVA (BIC)

**Date :** 21 juillet 2026
**Réalisé en autonomie** pendant l'absence du promoteur, selon le CDC V1.2 et la charte narrative BIC V1.0 (toutes deux validées).
**État :** site complet, buildé sans erreur, **fonctionnel sur localhost**. Prêt pour recette puis déploiement chantier.

---

## 1. Ce qui a été produit

Un site Next.js complet, `site-xpnova-bic/`, avec **17 pages** + pages système, **38 routes générées** au build (0 erreur, 0 avertissement).

| Zone | Pages |
|------|-------|
| Accueil | `/` — hero (manifeste + devise), 4 chiffres de preuve, 7 métiers, méthode, écosystème, 4 piliers, trajectoire 2 niveaux, 6 références, CTA |
| Cabinet | `/cabinet` — vision, mission, valeurs, trajectoire société/promoteur, gouvernance, identité légale |
| Métiers | `/metiers` + 7 fiches (`/metiers/[slug]`) : études-conseil, ingénierie, amo-amoa, maitrise-doeuvre, structuration-de-projets, suivi-evaluation, formation |
| Méthode | `/methode` — 6 phases détaillées (activités + livrables) |
| Références | `/references` (liste filtrable pays/métier) + 14 fiches (`/references/[slug]`), chacune avec **Cadre d'intervention** |
| Équipe | `/equipe` — fiche du fondateur (aucune catégorie ni profil fictif) + capacité de mobilisation |
| Ressources | `/ressources` — matrice public / sur demande |
| Engagements | `/engagements` — 5 politiques (ESG, genre, anti-corruption, qualité, HSE) |
| Contact | `/contact` — formulaire (honeypot, budget optionnel) + API `/api/contact` |
| Légal | `/mentions-legales`, `/confidentialite` (noindex) |
| Système | `not-found` (404), `sitemap.xml`, `robots.txt` |

## 2. Conformité au CDC V1.2 (points vérifiés)

- **C1** — Canonical sur `xp-nova.com` ; `robots.txt` renvoie `Disallow: /` tant que `SITE_ENV≠production` (chantier non indexable). Vérifié.
- **C7** — Chaque fiche référence porte le champ **Cadre d'intervention** (GEQUIPS / DGTC / XP-NOVA). Vérifié sur toutes les fiches.
- **C5/C6** — Frise à 2 niveaux : « La société » 2006·2026 / « Le promoteur » 1989·1997. Aucune date antérieure à 2006 attribuée à la société.
- **C19** — Baseline « Bureau d'Ingénierie Conseil » exclusive. **0 occurrence** de « développement rural » ou « Agri-Terra » sur tout le site (test automatisé).
- **C20** — Tokens Annexe A appliqués (navy #0D1F5C, royal #00289A, gold #D4A017).
- **C22** — Playfair Display + Source Sans 3 auto-hébergées.
- **Neutralité sectorielle** — Le corps éditorial BIC ne contient aucun vocabulaire sectoriel ; agriculture/élevage n'apparaissent que dans les passerelles autorisées vers AGROVITA/ODT.
- **CTA** — 2 CTA canoniques uniquement (« Parlons de votre projet », « Découvrir nos métiers »).
- **Perf/accessibilité** — SSG, typographie fluide (clamp), `prefers-reduced-motion`, focus visibles, `lang="fr"`, un seul H1/page, images `next/image`, alt systématiques.
- **SEO** — Metadata par page (titles/descriptions du CDC §4.2), JSON-LD (Organization+ProfessionalService, Service, Person, BreadcrumbList), OpenGraph, sitemap segmenté, og-image BIC corrigée (baseline + URL xp-nova.com).

## 3. Assets intégrés

Logos (SVG + PNG), favicon, polices Playfair Display / Source Sans 3 (dossier `public/`). L'og-image a été **régénérée en version BIC** (l'originale portait « Développement Rural » + URL agriterra — corrigé C19).

## 4. Mots de passe choisis (À CHANGER à la mise en production)

Fichier `.env.local` (non versionné) :

| Variable | Valeur chantier | Rôle |
|----------|-----------------|------|
| `SITE_ENV` | `chantier` | Bloque l'indexation. Passer à `production` à la bascule sur xp-nova.com. |
| `CHANTIER_PROTECT` | `off` | Protection Basic Auth du chantier. `off` sur localhost ; passer `on` pour le déploiement sur bingeco.xp-nova.com. |
| `CHANTIER_USER` | `xpnova` | Identifiant d'accès au chantier. |
| `CHANTIER_PASS` | `Chantier-BIC-2026!bingeco` | **Mot de passe temporaire — à remplacer.** |

> Ces identifiants ne protègent que la pré-production. Aucun mot de passe de votre compte n'a été utilisé ; le compte `jostenw2026-sudo` n'a pas été nécessaire à cette étape (localhost).

## 5. Lancer le site en local

```bash
cd site-xpnova-bic
npm install       # si nécessaire
npm run dev       # http://localhost:3000
# ou build de production :
npm run build && npm start
```

Le serveur de développement tourne actuellement sur **http://localhost:3000**.

## 6. Stack

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS 4 · React 19 · SSG. Contenu en fichiers structurés `src/content/*.ts` (repli CDC §8.2 ; le CMS Payload arrive en PH3). Formulaire : validation serveur + honeypot.

## 7. Reste à faire avant mise en production (rappel CDC — hors périmètre localhost)

1. **Contenus P0 restants** : photos réelles (chantiers, équipe, bureaux) ; rédaction des 5 politiques PDF et du Capability Statement (structures et emplacements déjà en place, marqués « à paraître ») ; fiches experts additionnelles.
2. **Branchement e-mail** du formulaire (Resend/SMTP) + Turnstile + rate limiting.
3. **Bandeau consentement** RGPD + GA4/Clarity après consentement.
4. **Correction du template documentaire** `.html` (baseline C19) pour les PDF.
5. **Déploiement chantier** sur bingeco.xp-nova.com : `CHANTIER_PROTECT=on`, nouveau mot de passe.
6. **Bascule production** : `SITE_ENV=production`, domaine xp-nova.com, 301 bingeco→apex, soumission sitemap en Search Console.

## 7 bis. Corrections après revue visuelle (21/07/2026)

Deux défauts signalés sur la maquette d'accueil, tous deux dus à un **conflit avec Tailwind v4** — corrigés dans les composants partagés, donc sur **toutes les pages** :

1. **Chevauchement des titres de section** — mes classes de titre s'appelaient `.h-1/.h-2/.h-3`, homonymes des utilitaires de hauteur Tailwind (`h-1` = 4 px…). Tailwind forçait la hauteur des titres à 4 px, faisant déborder le texte. **Fix** : classes renommées `.title-1/.title-2/.title-3/.title-hero` (les filets or `h-1 bg-gold` restent des vrais utilitaires Tailwind, préservés).
2. **Footer illisible (bleu sur bleu)** — mon CSS global (`a { color: royal }`) était hors `@layer`, écrasant les couleurs utilitaires des liens. **Fix** : styles d'éléments déplacés dans `@layer base`, les utilitaires Tailwind reprennent la priorité.

Vérifié : titres à bonne hauteur (128 px pour 2 lignes), liens footer en blanc 70 % sur navy. Build 38/38 OK.

## 8. Note technique

Le fichier de protection a été nommé `src/proxy.ts` (Next 16 a renommé `middleware` en `proxy`). Le workspace root est fixé dans `next.config.ts`. Build final : **38/38 pages, 0 erreur, 0 avertissement.**
