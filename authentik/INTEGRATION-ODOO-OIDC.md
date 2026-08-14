# Intégration Odoo ⇆ Authentik via OpenID Connect (OIDC / OAuth2)

Objectif : permettre la connexion à **Odoo** (`https://erp.xp-nova.com`) avec les comptes
**Authentik** (`https://auth.xp-nova.com`).

> Aucun secret dans ce document. Les `Client ID`/`Client Secret` réels restent dans
> Authentik et dans la config Odoo.

---

## 0. Contexte réel constaté (VPS)

| Élément | Valeur |
|---|---|
| Produit | **Odoo 19 Enterprise** (installation hôte, hors Docker) |
| Service systemd | `xpnova.service` (`systemctl restart xpnova` pour redémarrer) |
| Répertoire | `/opt/xpnova/xpnova-server` (venv `/opt/xpnova/xpnova-venv`) |
| Config | `/etc/xpnova-server.conf` |
| Ports | HTTP `8019`, gevent/longpolling `4519` |
| BDD | PostgreSQL hôte `127.0.0.1:5432`, user `xpnova` |
| addons_path | inclut `/opt/data/odoo/local_addonsv19` (emplacement pour modules custom) |
| Utilisateur système | `xpnova` |

Deux voies d'intégration :

| Voie | Module | Flux | Impact |
|---|---|---|---|
| **A (recommandée)** | `auth_oauth` **natif Odoo** | OAuth2 (token) | **UI seulement**, aucun redémarrage, aucun risque prod |
| B (avancée) | `auth_oidc` (OCA `server-auth`) | OIDC Authorization Code | + sécurisé, mais nécessite déposer un module + `systemctl restart xpnova` |

---

## 1. Côté Authentik — Provider + Application

### 1.a Provider
**Admin Authentik → Applications → Providers → Create → OAuth2/OpenID Provider**

| Champ | Valeur |
|---|---|
| Name | `odoo-provider` |
| Authorization flow | `default-provider-authorization-explicit-consent` |
| Client type | **Confidential** |
| Client ID | *(généré — à copier)* |
| Client Secret | *(généré — à copier, ne pas divulguer)* |
| **Redirect URIs** | `https://erp.xp-nova.com/auth_oauth/signin` |
| Signing Key | certificat auto-signé Authentik |
| Scopes | `openid`, `email`, `profile` |

> La Redirect URI **doit** être exactement `https://erp.xp-nova.com/auth_oauth/signin`
> (endpoint de retour utilisé par `auth_oauth` **et** `auth_oidc`).

### 1.b Application
**Applications → Applications → Create**

| Champ | Valeur |
|---|---|
| Name | `Odoo` |
| Slug | `odoo` |
| Provider | `odoo-provider` |
| Launch URL | `https://erp.xp-nova.com` |

### 1.c Endpoints (déduits du slug `odoo`)
```
Découverte : https://auth.xp-nova.com/application/o/odoo/.well-known/openid-configuration
Authorize  : https://auth.xp-nova.com/application/o/authorize/
Token      : https://auth.xp-nova.com/application/o/token/
UserInfo   : https://auth.xp-nova.com/application/o/userinfo/
JWKS       : https://auth.xp-nova.com/application/o/odoo/jwks/
Issuer     : https://auth.xp-nova.com/application/o/odoo/
```

---

## 2. Voie A — module natif `auth_oauth` (UI uniquement, sans redémarrage)

### 2.a Installer le module (aucun restart nécessaire)
1. Odoo → **Apps** → *Update Apps List* (mode développeur activé).
2. Rechercher **« OAuth2 Authentication »** (`auth_oauth`) → **Install**.

### 2.b Créer le provider OAuth dans Odoo
**Settings → Users & Companies → OAuth Providers → Create** :

| Champ Odoo | Valeur |
|---|---|
| Provider name | `XP-NOVA (Authentik)` |
| Client ID | *(Client ID du provider Authentik, §1.a)* |
| Allowed | ✅ |
| Login button label | `Se connecter avec XP-NOVA` |
| Authorization URL | `https://auth.xp-nova.com/application/o/authorize/` |
| UserInfo / Validation URL | `https://auth.xp-nova.com/application/o/userinfo/` |
| Scope | `openid email profile` |

3. **Enregistrer.** Un bouton « Se connecter avec XP-NOVA » apparaît sur l'écran de login Odoo.

> `auth_oauth` natif utilise le flux **token/implicite** : le provider Authentik doit
> autoriser ce mode. Si Authentik exige un `response_type` particulier, préférez la **Voie B**
> (Authorization Code), plus standard et plus sûre.

---

## 3. Voie B — module OCA `auth_oidc` (Authorization Code, avancé)

⚠️ **Nécessite un redémarrage d'Odoo** → planifier une courte fenêtre de maintenance
(prévenir, sauvegarder d'abord la base Odoo — voir §6).

1. Récupérer `auth_oidc` depuis **OCA `server-auth`** en **branche `19.0`**
   (si la 19.0 n'est pas encore publiée, rester sur la Voie A en attendant).
2. Déposer le module dans `/opt/data/odoo/local_addonsv19/` (déjà dans l'addons_path) :
   ```bash
   # en tant qu'utilisateur xpnova, dans /opt/data/odoo/local_addonsv19/
   git clone --branch 19.0 --depth 1 https://github.com/OCA/server-auth.git _oca_server_auth
   # lier uniquement le module auth_oidc (et ses dépendances) dans l'addons_path
   ```
3. **Sauvegarder la base** (voir §6), puis redémarrer : `sudo systemctl restart xpnova`
4. Odoo → **Apps** → *Update Apps List* → installer **« Authentication OpenID Connect »**.
5. **Settings → Users → OAuth Providers → Create** :
   - Flow : **OpenID Connect (authorization code flow)**
   - Client ID / **Client Secret** : ceux du provider Authentik (§1.a)
   - Scope : `openid profile email`
   - Discovery/endpoints : à partir de
     `https://auth.xp-nova.com/application/o/odoo/.well-known/openid-configuration`
   - JWKS : `https://auth.xp-nova.com/application/o/odoo/jwks/`

---

## 4. Provisionnement des utilisateurs — **PAS d'auto-création** (décision retenue)

- Odoo ne créera PAS automatiquement les comptes : seuls les utilisateurs **déjà présents
  dans Odoo** (même e-mail que dans Authentik) pourront se connecter en SSO.
- Vérifier que `auth_signup` **n'autorise pas** l'inscription libre :
  **Settings → Users → Signup**  = *« Log in only »* (pas *Free sign up*).
- Pour chaque utilisateur : créer/mettre à jour le compte Odoo avec l'e-mail Authentik.

---

## 5. Mapping des groupes (optionnel)

1. Authentik : **Customization → Property Mappings → Create → Scope Mapping**
   - Scope name : `groups`
   - Expression : `return [g.name for g in request.user.ak_groups.all()]`
   - Ajouter ce scope au provider (§1.a).
2. Odoo : exploiter le claim `groups` pour affecter les droits (règles avancées / module
   complémentaire). Ex. `XPN-ADMINS` ⇒ groupe d'administration Odoo. **Décision métier.**

---

## 6. Sauvegarde Odoo AVANT toute intervention à risque (Voie B)

```bash
# Dump de la base Odoo (user xpnova, PostgreSQL hote) — adapter <DB_ODOO>
sudo -u postgres pg_dump -Fc <DB_ODOO> > /root/odoo-<DB_ODOO>-$(date +%F-%H%M).dump
# + filestore
tar czf /root/odoo-filestore-$(date +%F-%H%M).tgz -C /opt/data/odoo .local/share/Odoo/filestore 2>/dev/null || true
```
> Le nom exact de la base Odoo se trouve via l'interface (sélecteur de base) ou
> `sudo -u postgres psql -l`. `db_name = False` dans la conf ⇒ multi-bases possible.

---

## 7. Test de bout en bout

1. **Garder une session admin Odoo local ouverte** (filet de sécurité).
2. Navigation privée → `https://erp.xp-nova.com/web/login`.
3. Cliquer **« Se connecter avec XP-NOVA »** → Authentik (login + MFA + consentement).
4. Retour Odoo, connecté avec le bon utilisateur. ✅

---

## 8. Retour arrière

- **Voie A** : Odoo → OAuth Providers → décocher *Allowed* (ou supprimer le provider).
  Aucun redémarrage, effet immédiat.
- **Voie B** : désinstaller le module `auth_oidc` puis `systemctl restart xpnova` ;
  restaurer le dump §6 si nécessaire.

---

## 9. Dépannage

| Symptôme | Piste |
|---|---|
| `redirect_uri_mismatch` | Redirect URI Authentik ≠ `https://erp.xp-nova.com/auth_oauth/signin`. |
| `invalid_client` | Client ID/Secret mal recopiés. |
| Connexion OK mais « user not found » | Aucun user Odoo avec cet e-mail (auto-création désactivée par choix). Créer le user. |
| Boucle de redirection | Vérifier `web.base.url = https://erp.xp-nova.com` (Paramètres système) et `web.base.url.freeze = True`. |
| Bouton SSO absent | Module `auth_oauth`/`auth_oidc` non installé ou provider *Allowed* décoché. |

---

## 10. Éléments à décider (humain)

- **Voie A vs B** : commencer par A (sans risque). Passer à B si l'on veut le flux
  Authorization Code (plus sûr) et si la branche OCA 19.0 est disponible.
- **Mapping des groupes** Authentik → droits Odoo (règles métier).
- Étendre le même schéma OIDC au **futur portail** clients/experts/fournisseurs.
