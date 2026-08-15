# Portail XP-NOVA — Bibliothèque documentaire (conception)

Gestion **dans Odoo** (module *Documents*, confirmé installé), exposée en **lecture
seule** dans le portail, filtrée par rôle. Aucune gestion documentaire n'est faite dans
le portail : Odoo reste le système de référence.

## Modules Odoo mobilisés (installés ✅)
- **`documents`** (+ `documents_project`, `documents_account`) — socle bibliothèque
- **`knowledge`** — articles / guides méthodologiques (wiki), complément
- `project`, `sale`, `account`, `purchase`, `crm`, `calendar`, `appointment`

## Organisation (taxonomie)

### Dossiers par audience (`documents.folder`) — pilotent les droits
- `Bibliothèque / Public`
- `Bibliothèque / Clients`
- `Bibliothèque / Experts`
- `Bibliothèque / Fournisseurs`
- `Bibliothèque / Interne`

### Étiquettes transversales (tags)
- **Type** : étude · rapport · guide méthodo · modèle/template · référentiel · publication
- **Métier** : études-conseil · ingénierie · AMO/AMOA · maîtrise d'œuvre · suivi-évaluation · formation
- **Confidentialité** : `public` · `clients` · `restreint` · `interne`

## Niveaux de confidentialité (4, validés)
| Niveau | Qui voit | Mise en œuvre |
|---|---|---|
| **Public** | Site + tous | Dossier `Public` (exposable aussi sur `/ressources`) |
| **Clients** | Comptes `XPN-CLIENTS` connectés | Dossier `Clients` |
| **Restreint** | Un client / projet précis | Filtré par `partner_id` / projet (le plus fin) |
| **Interne** | Staff XP-NOVA | Dossier `Interne` — jamais exposé au portail |

## Droits d'accès (rôle Authentik → contenu)
| Rôle | Voit |
|---|---|
| `XPN-CLIENTS` | Public + Clients + ses documents restreints (par `partner_id`/projet) |
| `XPN-EXPERTS` | Public + Experts |
| `XPN-FOURNISSEURS` | Public + Fournisseurs |
| `XPN-ADMINS` / `XPN-STAFF` | Tout (gestion dans Odoo) |

Le portail filtre selon **le rôle** (dossier) **et** le **partenaire lié** (documents restreints).

## Documents « sur demande » (conservé)
Certains documents sont **visibles (titre)** mais nécessitent une **demande d'accès** :
- Bouton **« Demander l'accès »** dans le portail → crée une demande dans Odoo
  (via `crm.lead` ou une activité, `helpdesk` n'étant pas installé) → un staff accorde.
- Cohérent avec le mécanisme existant de la page publique `/ressources`.

## Côté portail (module « Bibliothèque » — Phase B, lecture seule)
- Parcourir par dossier, filtrer par étiquette (type / métier)
- Recherche plein texte (titre / tags)
- Téléchargement des documents autorisés
- Bouton « Demander l'accès » pour les documents sur demande
- **Aucune écriture** : ajout/classement se font dans Odoo par le staff

## Architecture
```
Portail (/portail/bibliotheque)  ── session Authentik (rôle + partenaire) ──►
  DAL portail ── compte de service Odoo (lecture) ──► Odoo Documents
                                   (filtré: dossier d'audience + partner_id)
```

## Gouvernance (dans Odoo, par le staff)
- Cycle de vie : brouillon → validé → publié → archivé
- Nommage : `AAAA_Métier_Type_Titre_vX`
- Métadonnées obligatoires : dossier (audience) + étiquette confidentialité + type
- Revue périodique : archiver les versions obsolètes

## Prérequis techniques (Phase B, non fait ici)
- Créer un **compte de service Odoo** (droits lecture Documents) pour le portail.
- Établir le **lien identité** : utilisateur portail (`sub`/`email`) ↔ `res.partner` Odoo.
- Créer les **dossiers d'audience** et les **étiquettes** ci-dessus dans Odoo.

## État
- Socle Odoo (`documents`) : ✅ installé.
- Conception : ✅ validée (4 niveaux + sur-demande).
- Implémentation portail : ⏳ Phase B (à lancer).
