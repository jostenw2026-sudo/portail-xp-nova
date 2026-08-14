# Checklist de reprise — XP-NOVA / Authentik

À ouvrir en priorité au retour. Tout ce qui suit est **prêt à exécuter**, dans l'ordre.
Détails complets dans les autres fichiers du dossier `authentik/`.

---

## ✅ Déjà fait et opérationnel (rien à refaire)
- **Authentik** en production via Coolify : `https://auth.xp-nova.com` (TLS Let's Encrypt,
  isolation réseau, PostgreSQL + Redis dédiés, ports 9000/9443/5432/6379 non exposés).
- **Comptes** : `akadmin`, groupe `XPN-ADMINS` (superuser), `xpn-breakglass`.
- **Sauvegarde quotidienne** PostgreSQL Authentik : cron `30 2 * * *`, dump validé (~1,8 Mo).
- **Config SSO Odoo** posée et vérifiée : provider + application Authentik, fournisseur Odoo,
  utilisateur 6 lié (`oauth_uid = josten@xp-nova.com`), Subject mode Authentik = email.
- **Livrables** poussés sur GitHub (branche `claude/authentik-xp-nova-setup-pavk8r`).

---

## 🔴 PRIORITÉ 1 — Terminer le SSO Odoo (flux Authorization Code)

**Pourquoi** : le module natif `auth_oauth` (flux implicite) est rejeté par Authentik
(`unsupported_response_type`). Solution = module `auth_oidc` (flux code). Dispo confirmée :
OCA server-auth **19.0**, `auth_oidc` **19.0.1.0.0**.

**Fenêtre de maintenance courte** (redémarrage Odoo). Procédure exacte dans
`INTEGRATION-ODOO-OIDC.md` §3 (B1→B7). Résumé :

```bash
# B1 dépendance python
sudo -u xpnova /opt/xpnova/xpnova-venv/bin/pip install 'python-jose[cryptography]'
# B2 récupérer le module
sudo -u xpnova git clone --branch 19.0 --depth 1 https://github.com/OCA/server-auth.git /opt/data/odoo/server-auth
sudo -u xpnova ln -s /opt/data/odoo/server-auth/auth_oidc /opt/data/odoo/local_addonsv19/auth_oidc
# B3 sauvegarde + redémarrage
sudo -u postgres pg_dump -Fc xpnovadb > /root/xpnovadb-$(date +%F-%H%M).dump
sudo systemctl restart xpnova
```
Puis dans Odoo : Apps → Update List → installer **auth_oidc** ; éditer le fournisseur
« XP-NOVA (Authentik) » → **Auth Flow = OpenID Connect (authorization code flow)**,
ajouter le **Client Secret** (Authentik), JWKS `…/application/o/odoo/jwks/`, Token URL
`…/application/o/token/`. Re-test `/web/login`. La liaison utilisateur existante reste valable.

**Vérif après** : connexion SSO aboutie en navigation privée.

---

## 🟠 PRIORITÉ 2 — MFA Authentik (Phase 4 du cahier des charges)

Dans le navigateur, sur **chaque** compte (`akadmin` puis `xpn-breakglass`) —
`https://auth.xp-nova.com/if/user/#/settings` → **MFA Devices** :
1. **Enroll → TOTP** (scanner avec Aegis / 1Password / Google Auth).
2. **Enroll → Static (Recovery Codes)** → **stocker les codes HORS VPS**.
3. (option) **Enroll → WebAuthn** (passkey).
4. **Test** : déconnexion/reconnexion en navigation privée → le code TOTP est demandé.

⚠️ **Ne pas** rendre le MFA obligatoire globalement tant que les **deux** comptes n'ont pas
été testés avec succès (sinon risque de verrouillage). Une fois validé sur les 2 comptes,
créer une policy MFA obligatoire (m'en reparler pour la faire en sécurité).

---

## 🟡 OPTIONNEL — Sauvegarde chiffrée hors VPS

Fournir une destination (S3, autre serveur…). Ensuite :
```bash
rclone config    # créer un remote chiffré (crypt) une fois
# puis renseigner GPG_PASSPHRASE_FILE et RCLONE_REMOTE dans authentik-backup.sh
```
(Voir `OPERATIONS.md` §3.) Rétention 7/4/3 déjà en place.

---

## ⚪ SÉPARÉ (hors mission Authentik) — Erreurs websocket Odoo (port 4519)

Le log Odoo montre `Couldn't bind the websocket … evented port (4519)` sur `/websocket`.
C'est un souci de **routage longpolling/gevent** d'Odoo (le vhost nginx hôte `erp_xpnova.conf`
qui route `xpnova-chat → :4519` est **inactif** ; `systemctl is-active nginx` = inactive).
Sans rapport avec le SSO/Authentik. À traiter séparément : rétablir le routage `/websocket`
vers le port gevent 4519 (réactiver/adapter le reverse proxy d'Odoo). À planifier hors de
cette mission.

---

## 📋 Objectifs du cahier des charges initial — état

| Phase | Objectif | État |
|---|---|---|
| 1 | Audit sans modification | ✅ |
| 2 | Plan et validation | ✅ (adapté Coolify) |
| 3 | Installation Authentik (Docker, TLS, isolation, non-régression) | ✅ |
| 4 | Init (admin, XPN-ADMINS, break-glass) | ✅ ; **MFA à finaliser** (Priorité 2) |
| 5 | Sauvegardes & exploitation (quotidienne, rétention, docs) | ✅ ; hors-VPS optionnel |
| — | Livrable `INSTALLATION-XPNOVA.md` | ✅ |
| — | Intégration OIDC Odoo (prévue « plus tard ») | 🔴 **1 étape restante** (Priorité 1) |

**Cœur de la mission (SSO/MFA/IAM pour XP-NOVA) : atteint et opérationnel.**
Restent 2 finitions (SSO Odoo via code flow, MFA) — encadrées ci-dessus, ~20–30 min au total.
