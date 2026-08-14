# Audit complet + Runbook correctif — SSO Odoo ⇆ Authentik

But : documenter l'état réel de tout ce qui a été configuré, et fournir **une** séquence
ordonnée à exécuter en un passage pour finaliser le SSO Odoo (le seul point restant).

> Aucun secret dans ce document.

---

## 1. État réellement configuré (as-built)

### Authentik (SSO) — ✅ opérationnel
- Déployé via **Coolify** (service template Authentik), version **2025.10.3**.
- URL : `https://auth.xp-nova.com` (TLS Let's Encrypt via Coolify, HTTP→HTTPS OK).
- Conteneurs : `authentik-server`, `authentik-worker`, `postgresql-m11wfp0wh0mj7wyq0jwdwpfi`
  (PostgreSQL 16 dédié), Redis dédié. Ports 9000/9443/5432/6379 **non exposés** publiquement.
- Comptes : `akadmin`, groupe `XPN-ADMINS` (superuser), `xpn-breakglass`.

### Sauvegarde Authentik — ✅ opérationnel
- Script `/opt/authentik-backups/authentik-backup.sh` (PG_USER `73BDa45gwyhS6TDU`, DB `authentik`).
- Cron quotidien `30 2 * * *`. Dump validé (~1,8 Mo).

### Odoo — contexte
- **Odoo 19 Enterprise**, installation hôte (hors Docker).
- Service systemd **`xpnova.service`** ; lancement
  `/opt/xpnova/xpnova-venv/bin/python3 /opt/xpnova/xpnova-server/odoo-bin -c /etc/xpnova-server.conf`.
- Ports : HTTP **8019**, gevent **4519**. Base Odoo : **`xpnovadb`** (PostgreSQL hôte, user `xpnova`).
- Servi par un vhost nginx hôte **inactif** (`systemctl is-active nginx` = inactive) — le front
  public passe donc directement/via Coolify vers 8019/4519.

### Intégration OIDC configurée
**Côté Authentik :**
- Provider `odoo Provider` (OAuth2/OpenID), client **Confidential**,
  Redirect URI `https://erp.xp-nova.com/auth_oauth/signin`,
  scopes `openid`/`email`/`profile`, **Subject mode = email** (à confirmer *enregistré*).
- Application `Odoo` (slug `odoo`), liée au provider, policy `ANY`.

**Côté Odoo :**
- Module natif **`auth_oauth`** installé (flux **implicite**).
- Fournisseur OAuth « XP-NOVA (Authentik) » (id **4**), *Autorisé* ✅,
  Auth URL `.../application/o/authorize/`, UserInfo `.../application/o/userinfo/`,
  scope `openid profile email`.
- Utilisateur **id 6** (`josten@xp-nova.com`) lié en base :
  `oauth_provider_id = 4`, `oauth_uid = josten@xp-nova.com`.

### Symptôme restant
Le flux fonctionne (redirection Authentik → authentification → retour Odoo) mais Odoo
renvoie **« Accès refusé »** (`/web/login?oauth_error=2`).

---

## 2. CAUSE RACINE CONFIRMÉE (par les logs Odoo)

Le log `/opt/xpnova/odoo19.log` montre, au moment du clic :
```
GET /auth_oauth/signin?error=unsupported_response_type
&error_description=The authorization server does not support obtaining
 an authorization code using this method  ... 303
```
➡️ **Authentik rejette la requête d'autorisation d'Odoo avec `unsupported_response_type`.**

Raison : le module natif Odoo **`auth_oauth` utilise le flux implicite** (`response_type=token`),
que **Authentik ne supporte pas** (Authentik accepte `code`, `id_token`, `id_token token`…,
mais pas le `token` implicite seul). Vérifiable via :
`…/application/o/odoo/.well-known/openid-configuration` → `response_types_supported`.

**Conséquence** : aucune correction de Client ID / subject / liaison utilisateur ne peut
débloquer ce cas (tout cela est déjà correct). Il faut **changer de flux** →
**Authorization Code via `auth_oidc`** (voir §5), pleinement supporté par Authentik.

Les causes C1/C2 ci-dessous ont été **écartées** par les vérifications (sub_mode=user_email,
utilisateur 6 interne et lié). Elles sont conservées pour mémoire.

## 2bis. Analyse initiale — pourquoi `oauth_error=2` (historique)

`oauth_error=2` = OAuth validé mais **aucun utilisateur Odoo correspondant / pas de création**.
Après liaison de l'utilisateur 6, il ne reste que **4 causes possibles** :

| # | Cause | Test |
|---|---|---|
| C1 | Le `sub` envoyé par Authentik ≠ `josten@xp-nova.com` (Subject mode non enregistré) | D1 |
| C2 | L'utilisateur 6 est un compte **portail/share** (pas interne) → backend refusé | D2 |
| C3 | Odoo ne récupère pas de `sub` du userinfo (« Missing subject identity », souci token implicite) | D3 |
| C4 | Doublon d'utilisateur / oauth_uid déjà lié ailleurs | D2/D3 |

Rappel technique : Odoo `auth_oauth` unifie l'identifiant en lisant **`sub` en priorité**.
Donc si Subject mode=email **est bien enregistré**, `sub = email` = ce qu'on a mis dans `oauth_uid`.

---

## 3. Runbook correctif — à exécuter dans l'ordre (VPS)

### D1 — Le Subject mode est-il vraiment enregistré côté Authentik ?
```bash
docker exec postgresql-m11wfp0wh0mj7wyq0jwdwpfi \
  psql -U 73BDa45gwyhS6TDU -d authentik -tAc \
  "SELECT name, sub_mode, client_type FROM authentik_providers_oauth2_oauth2provider;"
```
- Attendu pour le provider Odoo : `sub_mode = user_email`.
- **Si ≠ `user_email`** → le réglage n'a pas été sauvegardé. Correctif :
  Authentik → Providers → `odoo Provider` → Edit → *Subject mode = Based on the User's Email*
  → **Mettre à jour**. Puis re-tester (§4).

### D2 — L'utilisateur Odoo 6 est-il interne, actif, bien lié ?
```bash
sudo -u postgres psql -d xpnovadb -c \
 "SELECT id, login, active, share, oauth_provider_id, oauth_uid FROM res_users WHERE id=6;"
```
- Attendu : `active = t`, **`share = f`** (interne), `oauth_provider_id = 4`,
  `oauth_uid = josten@xp-nova.com`.
- **Si `share = t`** (utilisateur portail) → le backend refuse. Correctif : utiliser/lier un
  utilisateur **interne**. Trouver l'utilisateur interne voulu :
  ```bash
  sudo -u postgres psql -d xpnovadb -c \
   "SELECT id, login, active, share FROM res_users WHERE login ILIKE '%josten%' OR login ILIKE '%xp-nova%';"
  ```
  puis relier le **bon id interne** :
  ```bash
  sudo -u postgres psql -d xpnovadb <<'SQL'
  UPDATE res_users SET oauth_provider_id=NULL, oauth_uid=NULL WHERE id=6;   -- défait l'ancienne liaison
  UPDATE res_users u SET oauth_provider_id=p.id, oauth_uid='josten@xp-nova.com'
    FROM auth_oauth_provider p
   WHERE u.id=<ID_INTERNE> AND p.name ILIKE '%XP-NOVA%';
  SELECT id, login, share, oauth_provider_id, oauth_uid FROM res_users WHERE id=<ID_INTERNE>;
  SQL
  ```

### D3 — Que dit Odoo au moment exact du clic ?
Cliquer « Se connecter avec XP-NOVA », puis :
```bash
sudo journalctl -u xpnova --since "3 min ago" --no-pager \
 | grep -iE 'oauth|sub|denied|missing subject|validation|Traceback|access' | tail -50
```
- **« Missing subject identity »** → Odoo ne reçoit pas de `sub` du userinfo (cause C3).
  Vérifier que le scope `openid` est bien demandé côté Odoo et présent côté provider ; si le
  flux implicite reste capricieux, passer à la **Voie B** (§5).
- **AccessDenied sans autre détail** → cause C1/C2 (traiter via D1/D2).

---

## 4. Re-test (après chaque correctif)
Navigation privée → `https://erp.xp-nova.com/web/login` → « Se connecter avec XP-NOVA ».
Succès = arrivée dans le backend Odoo connecté en tant que `josten@xp-nova.com`.

---

## 5. Voie B (repli robuste) — Authorization Code via OCA `auth_oidc`

Si le flux implicite d'`auth_oauth` reste bloquant, basculer sur le flux **Authorization Code**
(plus standard, plus fiable avec Authentik) :

1. Vérifier la disponibilité de la branche **19.0** d'OCA `server-auth`
   (`https://github.com/OCA/server-auth`). Si indisponible, rester en Voie A.
2. Déposer `auth_oidc` (+ dépendances) dans `/opt/data/odoo/local_addonsv19/`.
3. **Sauvegarder la base Odoo** :
   ```bash
   sudo -u postgres pg_dump -Fc xpnovadb > /root/xpnovadb-$(date +%F-%H%M).dump
   ```
4. `sudo systemctl restart xpnova` (courte fenêtre de maintenance).
5. Odoo → Apps → Update List → installer « Authentication OpenID Connect ».
6. Créer le provider OIDC (flow *authorization code*), Client ID **+ Client Secret**,
   discovery `https://auth.xp-nova.com/application/o/odoo/.well-known/openid-configuration`.
7. Re-test (§4).

Le provider Authentik étant **Confidential**, il possède déjà un Client Secret utilisable par
la Voie B (pas nécessaire en Voie A).

---

## 6. Annuler / revenir en arrière
- Liaison Odoo : `UPDATE res_users SET oauth_provider_id=NULL, oauth_uid=NULL WHERE id=<id>;`
- Fournisseur Odoo : décocher *Autorisé* (le bouton SSO disparaît, aucun redémarrage).
- Aucune de ces actions n'affecte les autres sites, Coolify, ni Authentik.

---

## 7. Reste à faire (indépendant du SSO)
- **① MFA** : enrôler TOTP + codes de secours (hors VPS) sur `akadmin` **et** `xpn-breakglass`,
  tester en navigation privée, **avant** toute politique MFA obligatoire globale.

---

## 8. Verdict d'audit
| Chantier | État |
|---|---|
| Authentik (install, TLS, isolation) | ✅ Conforme |
| Sauvegarde quotidienne | ✅ Opérationnelle |
| OIDC Odoo — configuration | ✅ Posée intégralement |
| OIDC Odoo — connexion effective | ⛔ Bloquée sur `oauth_error=2` → **suivre §3 (D1→D2→D3)** |
| MFA | 🟡 À réaliser (navigateur) |

Cause la plus probable, à traiter en premier : **D1** (Subject mode non enregistré) puis **D2**
(utilisateur 6 de type portail). L'un des deux résout le blocage dans la grande majorité des cas.
