# Portail XP-NOVA — clients / experts / fournisseurs

Espace sécurisé intégré au site (Next.js 16), authentifié via **Authentik** en
**OpenID Connect (Authorization Code + PKCE)**. Rôles déduits des groupes Authentik.

## Routes

| Route | Rôle |
|---|---|
| `/portail/login` | Page de connexion (publique) — bouton « Se connecter avec XP-NOVA » |
| `/api/auth/login` | Démarre le flux OIDC (state/nonce/PKCE → Authentik) |
| `/api/auth/callback` | Retour OIDC : échange du code, vérif id_token, ouverture de session |
| `/api/auth/logout` | Déconnexion (supprime la session) |
| `/portail` | Tableau de bord selon le rôle (protégé) |

Protection des routes : `src/proxy.ts` (contrôle optimiste de présence de session) +
DAL `src/lib/portal/dal.ts` (`verifySession()` — vérification réelle côté page).

## Rôles ⇄ groupes Authentik

| Rôle portail | Groupe(s) Authentik (par défaut) |
|---|---|
| admin | `XPN-ADMINS`, `XPN-STAFF` |
| client | `XPN-CLIENTS` |
| expert | `XPN-EXPERTS` |
| fournisseur | `XPN-FOURNISSEURS` |

Priorité : admin > client > expert > fournisseur. Un compte sans groupe → « invité »
(authentifié mais sans accès, message d'orientation affiché).

## Configuration Authentik (à faire une fois)

1. **Créer un provider OAuth2/OpenID** dédié au portail :
   - Name : `portail-provider`
   - Client type : **Confidential**
   - **Redirect URIs** : `https://<domaine-du-site>/api/auth/callback`
     (et `http://localhost:3000/api/auth/callback` pour le dev)
   - Scopes : `openid`, `email`, `profile`, **`groups`**
   - Noter `Client ID` et `Client Secret`.
2. **Créer l'application** : Name `Portail`, **Slug `portail`**, provider ci-dessus.
   *(Le slug `portail` sert à construire l'issuer/jwks : `…/application/o/portail/…`.)*
3. **Exposer les groupes** : Customization → Property Mappings → Create → Scope Mapping :
   - Scope name : `groups`
   - Expression : `return [g.name for g in request.user.ak_groups.all()]`
   - Ajouter ce scope au provider (étape 1).
4. **Créer les groupes** : `XPN-CLIENTS`, `XPN-EXPERTS`, `XPN-FOURNISSEURS`
   (et `XPN-STAFF` si besoin), puis y affecter les utilisateurs.

## Variables d'environnement (`.env.local`, NON commité)

```bash
# URL publique du site (pour la redirect_uri)
PORTAL_BASE_URL=https://xp-nova.com          # en dev : http://localhost:3000

# Authentik
PORTAL_AUTHENTIK_BASE_URL=https://auth.xp-nova.com
PORTAL_OIDC_SLUG=portail
PORTAL_OIDC_CLIENT_ID=<client id du provider portail>
PORTAL_OIDC_CLIENT_SECRET=<client secret>
PORTAL_OIDC_SCOPES="openid email profile groups"

# Secret de signature de session (JWT HS256) — générequired
#   openssl rand -base64 32
PORTAL_SESSION_SECRET=<valeur aléatoire>

# (optionnel) surcharge des noms de groupes
# PORTAL_GROUP_ADMIN=XPN-ADMINS,XPN-STAFF
# PORTAL_GROUP_CLIENT=XPN-CLIENTS
# PORTAL_GROUP_EXPERT=XPN-EXPERTS
# PORTAL_GROUP_FOURNISSEUR=XPN-FOURNISSEURS
```

## Développement

```bash
npm install
npm run dev
# http://localhost:3000/portail  → redirige vers /portail/login
```

## Sécurité (implémenté)

- Flux **Authorization Code + PKCE** (S256), `state` + `nonce` anti-rejeu (cookies httpOnly courts).
- Vérification de l'**id_token** (signature via JWKS Authentik, `iss`, `aud`, `nonce`).
- Session **stateless** : JWT HS256 signé, cookie **httpOnly / Secure / SameSite=Lax**,
  ne contenant que l'identité + le rôle (aucun jeton d'accès stocké).
- MFA hérité d'Authentik (obligatoire globalement).

## Limites de cette 1ʳᵉ itération (MVP)

- Contenus des tableaux de bord = **placeholders** (pas encore branchés à une source réelle).
- Prochaine étape : brancher les données (Odoo via API, ou base dédiée) par rôle,
  et affiner le mapping groupes → autorisations fines.
