# Intégration Odoo ⇆ Authentik via OpenID Connect (OIDC)

Objectif : permettre la connexion à **Odoo** (`https://erp.xp-nova.com`) avec les comptes
**Authentik** (`https://auth.xp-nova.com`), en SSO OIDC (Authorization Code Flow).

> Prérequis : Authentik opérationnel (fait), Odoo accessible en HTTPS (fait).
> Aucun secret ne figure dans ce document — les `Client ID`/`Client Secret` réels
> restent dans Authentik et dans la config Odoo.

---

## 0. Choix du module côté Odoo

| Module | Type | Recommandation |
|---|---|---|
| `auth_oidc` (OCA – dépôt `OCA/server-auth`) | OIDC **Authorization Code Flow** | ✅ **Recommandé** (sécurisé, standard OIDC) |
| `auth_oauth` (natif Odoo) | OAuth2 **Implicit Flow** | Repli si OCA indisponible (moins sécurisé) |

Ce guide décrit le chemin **`auth_oidc`**. La variante native est en annexe.

⚠️ **Décision humaine** : installer le module `auth_oidc` suppose d'ajouter le dépôt
OCA `server-auth` (branche correspondant à votre version d'Odoo : 16.0 / 17.0 / 18.0)
aux addons, puis de redémarrer Odoo. À valider selon votre mode de déploiement Odoo
(Coolify ? image custom ? addons montés ?).

---

## 1. Côté Authentik — créer le Provider + l'Application

### 1.a Provider OAuth2/OpenID
**Admin Authentik → Applications → Providers → Create → OAuth2/OpenID Provider**

| Champ | Valeur |
|---|---|
| Name | `odoo-oidc-provider` |
| Authorization flow | `default-provider-authorization-explicit-consent` (ou implicit-consent) |
| Client type | **Confidential** |
| Client ID | *(généré — à copier)* |
| Client Secret | *(généré — à copier, ne pas divulguer)* |
| Redirect URIs / Origins | `https://erp.xp-nova.com/auth_oauth/signin` |
| Signing Key | certificat auto-signé Authentik par défaut |
| Scopes | `openid`, `email`, `profile` (par défaut) |

> La redirect URI **doit** correspondre exactement à celle attendue par Odoo
> (`/auth_oauth/signin` est l'endpoint de retour, utilisé aussi par `auth_oidc`).

### 1.b Application
**Applications → Applications → Create**

| Champ | Valeur |
|---|---|
| Name | `Odoo` |
| Slug | `odoo` |
| Provider | `odoo-oidc-provider` (celui du 1.a) |
| Launch URL | `https://erp.xp-nova.com` |

### 1.c URLs OIDC à récupérer
Après création, l'URL de découverte (tout est dedans) :
```
https://auth.xp-nova.com/application/o/odoo/.well-known/openid-configuration
```
Endpoints individuels (déduits du slug `odoo`) :
```
Issuer         : https://auth.xp-nova.com/application/o/odoo/
Authorization  : https://auth.xp-nova.com/application/o/authorize/
Token          : https://auth.xp-nova.com/application/o/token/
UserInfo       : https://auth.xp-nova.com/application/o/userinfo/
JWKS           : https://auth.xp-nova.com/application/o/odoo/jwks/
End session    : https://auth.xp-nova.com/application/o/odoo/end-session/
```

---

## 2. Côté Odoo — configurer le provider OIDC (`auth_oidc`)

1. **Installer** le module `auth_oidc` (Apps → rechercher « OpenID Connect » →
   Installer ; nécessite le dépôt OCA `server-auth` dans les addons).
2. Activer le **mode développeur** (Settings → Developer Tools) si les champs avancés
   ne sont pas visibles.
3. **Settings → Users & Companies → OAuth Providers** → *Create* :

| Champ Odoo | Valeur |
|---|---|
| Provider name | `Authentik` |
| Allowed | ✅ coché |
| Login button label | `Se connecter avec XP-NOVA` |
| Flow | **OpenID Connect (authorization code flow)** |
| Client ID | *(Client ID du provider Authentik, §1.a)* |
| Client Secret | *(Client Secret du provider Authentik, §1.a)* |
| Scope | `openid profile email` |
| Authorization Endpoint | `https://auth.xp-nova.com/application/o/authorize/` |
| Token Endpoint | `https://auth.xp-nova.com/application/o/token/` |
| UserInfo Endpoint | `https://auth.xp-nova.com/application/o/userinfo/` |
| JWKS URL | `https://auth.xp-nova.com/application/o/odoo/jwks/` |
| Issuer / Discovery | `https://auth.xp-nova.com/application/o/odoo/` |

4. **Enregistrer.**

> Selon la version de `auth_oidc`, certains champs (Token/UserInfo/JWKS) se remplissent
> automatiquement à partir de l'URL de découverte `.well-known`. Si un champ
> « Well Known / Discovery URL » existe, renseignez :
> `https://auth.xp-nova.com/application/o/odoo/.well-known/openid-configuration`.

---

## 3. Provisionnement des utilisateurs

- **Correspondance** : Odoo relie l'utilisateur OIDC via l'e-mail (claim `email`).
  Les comptes doivent donc avoir un e-mail cohérent des deux côtés.
- **Création automatique** : par défaut, Odoo n'auto-crée PAS les utilisateurs OAuth.
  Deux options :
  - Créer d'abord l'utilisateur dans Odoo (même e-mail), puis il pourra se connecter en SSO.
  - Ou activer l'auto-provisioning via `auth_oidc`/`auth_signup` (à évaluer — implication
    sécurité : tout compte Authentik pourrait créer un user Odoo). **Décision humaine.**

---

## 4. Mapping des groupes / rôles (optionnel, recommandé)

1. Dans Authentik, ajouter au provider un **Scope Mapping** exposant les groupes
   (claim `groups`) — **Customization → Property Mappings → Create → Scope Mapping** :
   - Scope name : `groups`
   - Expression : `return [group.name for group in request.user.ak_groups.all()]`
   - Ajouter ce scope au provider (§1.a).
2. Côté Odoo, mapper `groups` → groupes Odoo (via règles `auth_oidc` avancées ou module
   complémentaire). Permet p.ex. que `XPN-ADMINS` ⇒ administrateurs Odoo.
   *(Le mapping fin des droits Odoo est une décision métier — à définir avec vous.)*

---

## 5. Test de bout en bout

1. Fenêtre de navigation privée → `https://erp.xp-nova.com`.
2. Sur l'écran de login Odoo, cliquer **« Se connecter avec XP-NOVA »**.
3. Redirection vers Authentik → authentification (+ MFA) → consentement.
4. Retour sur Odoo, connecté. ✅
5. Vérifier que l'utilisateur est bien celui attendu (e-mail, droits).

> ⚠️ **Garder un compte administrateur Odoo local** (login/mot de passe classique) actif
> pendant les tests, en filet de sécurité si le SSO échoue.

---

## 6. Dépannage

| Symptôme | Piste |
|---|---|
| `redirect_uri_mismatch` | La Redirect URI d'Authentik (§1.a) doit être exactement `https://erp.xp-nova.com/auth_oauth/signin`. |
| `invalid_client` | Client ID/Secret mal recopiés entre Authentik et Odoo. |
| Connexion OK mais « user not found » | Aucun utilisateur Odoo avec cet e-mail ; créez-le ou activez l'auto-provisioning. |
| Erreur signature/JWKS | JWKS URL erronée ; vérifier le slug (`odoo`) et l'issuer. |
| Boucle de redirection | Vérifier que `web.base.url` d'Odoo = `https://erp.xp-nova.com` et `web.base.url.freeze`=True. |

---

## Annexe A — Variante module natif `auth_oauth` (repli)

Odoo natif utilise l'**implicit flow**. Dans **Settings → Users → OAuth Providers** :
- Provider name : `Authentik`
- Client ID : *(Authentik)*
- Allowed : ✅
- Auth Endpoint : `https://auth.xp-nova.com/application/o/authorize/`
- Scope : `openid email profile`
- Validation Endpoint (UserInfo) : `https://auth.xp-nova.com/application/o/userinfo/`
- Data Endpoint : `https://auth.xp-nova.com/application/o/userinfo/`

Dans Authentik, le provider doit alors autoriser le **flow implicite** et la redirect URI
`https://erp.xp-nova.com/auth_oauth/signin`. Moins sécurisé que `auth_oidc` — à réserver
au cas où le module OCA n'est pas déployable.

---

## Éléments à décider (humain)

- Version exacte d'Odoo et **mode d'ajout des addons** (pour installer `auth_oidc`).
- **Auto-provisioning** des utilisateurs (oui/non) et politique de sécurité associée.
- **Mapping des groupes** Authentik → droits Odoo (règles métier).
- Étendre ensuite le même schéma au **futur portail** clients/experts/fournisseurs.
