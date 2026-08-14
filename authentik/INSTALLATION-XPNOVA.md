# Authentik — Installation XP-NOVA

Fournisseur d'identité (SSO / MFA / IAM) open source pour l'écosystème XP-NOVA.
Déployé en **production** via **Coolify** sur le VPS Hostinger.

> ⚠️ Ce document ne contient **aucun secret** (mots de passe, clés, tokens).
> Les secrets sont gérés et chiffrés par Coolify.

---

## 1. Architecture réellement installée

```
                 Internet
                    │
             (DNS auth.xp-nova.com)
        A    31.97.52.200
        AAAA 2a02:4780:28:1535::1
                    │
              ┌─────▼─────┐   ports 80 / 443 (déjà en place)
              │ coolify-  │   Traefik v3.4 — reverse proxy géré par Coolify
              │  proxy    │   TLS Let's Encrypt (auto-renouvelé)
              └─────┬─────┘
                    │ route interne  ->  authentik-server:9000
        ┌───────────▼──────────────────────────────┐
        │  Ressource Coolify « Authentik »          │
        │  (réseau Docker privé, non exposé)        │
        │                                           │
        │  authentik-server   (web UI + API, :9000) │
        │  authentik-worker   (tâches de fond)      │
        │  postgresql         (PostgreSQL 16 DÉDIÉ) │
        │  redis              (Redis DÉDIÉ)         │
        └───────────────────────────────────────────┘
```

- **Isolation totale** : PostgreSQL et Redis d'Authentik sont **dédiés**, distincts
  de la base Coolify (`coolify-db`), du PostgreSQL hôte (`postgresql@16-main`),
  du MySQL hôte et d'Odoo. Aucune base partagée.
- **Version Authentik** : `ghcr.io/goauthentik/server:2025.10.3`.

## 2. URL publique

- Interface / SSO : **https://auth.xp-nova.com**
- Console admin : **https://auth.xp-nova.com/if/admin/**
- Interface utilisateur : **https://auth.xp-nova.com/if/user/**

`http://` est automatiquement redirigé vers `https://`.

## 3. Emplacements des fichiers importants (sans secrets)

| Élément | Emplacement |
|---|---|
| Définition de la ressource (compose + variables) | **Coolify** → Project → ressource *Authentik* (stocké chiffré dans la base Coolify) |
| Volumes de données Docker | Gérés par Coolify : `..._authentik-db` (PostgreSQL), volume Redis, `media`, `templates` |
| Scripts de sauvegarde/restauration | `authentik/scripts/authentik-backup.sh`, `authentik/scripts/authentik-restore.sh` (ce dépôt) — à déployer dans `/opt/authentik-backups/` sur le VPS |
| Journal d'exploitation | `authentik/OPERATIONS.md` (ce dépôt) |

> La configuration du reverse proxy est **générée automatiquement par Coolify** à partir
> du champ *Domains* (`https://auth.xp-nova.com:9000`). **Ne jamais l'éditer à la main** :
> Coolify régénère la conf Traefik et écraserait toute modification manuelle.

## 4. Services Docker

| Conteneur | Image | Rôle | Exposition |
|---|---|---|---|
| `authentik-server-*` | `ghcr.io/goauthentik/server:2025.10.3` | Web UI + API | via proxy uniquement (port 9000 interne) |
| `authentik-worker-*` | `ghcr.io/goauthentik/server:2025.10.3` | Tâches asynchrones | aucune |
| `postgresql-*` | `postgres:16-alpine` | Base Authentik dédiée | interne uniquement (5432) |
| `redis-*` | `redis:alpine` | Cache / files Authentik | interne uniquement (6379) |

## 5. Contrôles de sécurité effectués

- ✅ Ports **9000 / 9443 / 5432 / 6379 non exposés publiquement** (vérifié via `ss -tulpn`).
- ✅ Accès public **uniquement** via `https://auth.xp-nova.com` (Traefik/Coolify).
- ✅ Certificat TLS **Let's Encrypt valide**, renouvellement automatique par Coolify.
- ✅ Redirection HTTP → HTTPS active.
- ✅ Secrets (`AUTHENTIK_SECRET_KEY`, mot de passe PostgreSQL) générés aléatoirement,
  stockés chiffrés par Coolify, **jamais** en clair dans un fichier du dépôt.
- ✅ Services existants préservés : `xp-nova.com`, `agrovita.xp-nova.com`,
  `odt.xp-nova.com`, `erp.xp-nova.com` (Odoo), dashboard Coolify — tous opérationnels.
- ✅ Ports 80/443/22 et règles UFW **inchangés**.

## 6. Ports publics autorisés (état du VPS)

| Port | Service | Remarque |
|---|---|---|
| 22 | SSH | inchangé |
| 80 | Traefik (Coolify) | redirige vers 443 |
| 443 | Traefik (Coolify) | sert tous les domaines dont `auth.xp-nova.com` |

> Authentik n'ouvre **aucun** port supplémentaire sur l'hôte.

## 7. Comptes et MFA

- Compte admin principal : `akadmin` (créé via `/if/flow/initial-setup/`).
- Groupe admin : **`XPN-ADMINS`** (superuser).
- Compte de secours (break-glass) : **`xpn-breakglass`** (membre de `XPN-ADMINS`).
- MFA : TOTP + Passkey/WebAuthn + codes de récupération (stockés **hors VPS**).
- ⚠️ Le MFA **n'est pas** rendu obligatoire globalement tant que les deux comptes admin
  n'ont pas été testés avec succès.

## 8. Sauvegarde / restauration

Voir `authentik/OPERATIONS.md` (procédures détaillées, rétention 7/4/3).

## 9. Mise à jour

Voir `authentik/OPERATIONS.md` (toujours **sauvegarder avant** de mettre à jour).

## 10. Étapes prévues plus tard — intégration OpenID Connect

Objectif : connecter Odoo puis le futur portail clients/experts/fournisseurs à Authentik.

1. Dans Authentik : **Applications → Providers → Create → OAuth2/OpenID Provider**
   (un provider par application : Odoo, portail, etc.).
2. Récupérer `Client ID`, `Client Secret`, et les URLs OIDC de découverte
   (`https://auth.xp-nova.com/application/o/<slug>/.well-known/openid-configuration`).
3. **Odoo** : installer le module OAuth/OIDC (ou `auth_oidc`), déclarer le provider,
   mapper les revendications (email, groupes) sur les utilisateurs Odoo.
4. Définir les redirect URIs de chaque application (`https://erp.xp-nova.com/...`).
5. Utiliser les **groupes Authentik** (ex. `XPN-ADMINS`, groupes métier) pour piloter
   les autorisations côté applications.

## 11. Éléments qui demandent encore une décision humaine

- Choix de la **destination hors VPS** pour les sauvegardes chiffrées (S3, autre VPS, etc.).
- Décision d'activer une **policy MFA obligatoire** (après tests des deux comptes admin).
- Politique de **rétention/rotation** des comptes et des groupes métier.
- Correction éventuelle du **dashboard Traefik exposé sur le port 8080** (constat d'audit,
  hors périmètre de cette installation — à traiter séparément).
- Cadence et cible des **mises à jour** Authentik (canal stable recommandé).
