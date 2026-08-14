# Authentik — Journal d'exploitation (XP-NOVA)

Procédures d'exploitation d'Authentik déployé via Coolify.
**Aucun secret ne doit figurer dans ce document.**

---

## 1. Sauvegarde de la base PostgreSQL Authentik

Deux approches, complémentaires.

### 1.a — Backups planifiés Coolify (recommandé en complément)

Dans Coolify → ressource *Authentik* → service **postgresql** → onglet **Backups** :
- Activer une sauvegarde **quotidienne**.
- Définir une destination (locale et/ou S3-compatible).
- Coolify gère la planification et la rétention.

### 1.b — Script cron (maîtrisé, rétention 7/4/3)

Script fourni : `authentik/scripts/authentik-backup.sh`.

Installation sur le VPS :
```bash
sudo mkdir -p /opt/authentik-backups
sudo cp authentik/scripts/authentik-backup.sh /opt/authentik-backups/
sudo cp authentik/scripts/authentik-restore.sh /opt/authentik-backups/
sudo chmod 700 /opt/authentik-backups/*.sh

# Renseigner le nom exact du conteneur PostgreSQL Authentik :
docker ps --format '{{.Names}}' | grep '^postgresql-'
#   -> éditer PG_CONTAINER dans authentik-backup.sh (et restore) si différent

# IMPORTANT : Coolify génère un utilisateur/base PostgreSQL propres à la ressource.
# Récupérer les vrais noms (n'affiche PAS le mot de passe) et les reporter dans
# PG_USER / PG_DB des scripts :
docker exec <PG_CONTAINER> env | grep -E '^POSTGRES_(USER|DB)='
#   -> PG_USER = valeur de POSTGRES_USER ; PG_DB = valeur de POSTGRES_DB
```

Planification (cron root, tous les jours à 02h30) :
```bash
sudo crontab -e
# Ajouter :
30 2 * * * /opt/authentik-backups/authentik-backup.sh >> /var/log/authentik-backup.log 2>&1
```

Rétention appliquée automatiquement : **7 quotidiennes, 4 hebdomadaires, 3 mensuelles**
(les copies hebdo/mensuelles sont promues le dimanche et le 1er du mois).

Chiffrement (optionnel) : créer un fichier passphrase (chmod 600) et pointer
`GPG_PASSPHRASE_FILE` dessus dans le script — voir en-tête du script.

## 2. Sauvegarde de la configuration

- **Compose + variables d'environnement** : stockés dans Coolify. Les exporter depuis
  l'UI Coolify (ressource *Authentik*) et conserver l'export en lieu sûr.
- **Coolify lui-même** : activer les sauvegardes de Coolify (Settings → Backup) pour
  préserver la définition des ressources (dont Authentik).
- **Reverse proxy** : généré par Coolify — pas de sauvegarde manuelle nécessaire ;
  il est reconstruit à partir de la config Coolify.

## 3. Copie hors VPS (chiffrée)

Quand une destination est disponible :
```bash
rclone config                       # configurer un remote chiffré (crypt) une seule fois
# puis dans authentik-backup.sh, renseigner RCLONE_REMOTE, ex :
#   RCLONE_REMOTE="crypt-remote:authentik-backups"
```
Le script enverra alors chaque dump vers la destination distante après création locale.

## 4. Test de restauration

Script fourni : `authentik/scripts/authentik-restore.sh`.
```bash
# De préférence sur un environnement de test, PAS directement en production :
sudo /opt/authentik-backups/authentik-restore.sh \
     /opt/authentik-backups/daily/authentik-AAAA-MM-JJ-HHMM.sql.gz
# Puis redémarrer la ressource Authentik (server + worker) dans Coolify.
```
Vérifier ensuite la connexion sur https://auth.xp-nova.com et l'intégrité des comptes.

## 5. Mise à jour d'Authentik

**Toujours sauvegarder AVANT (section 1).**

Méthode Coolify (recommandée) :
1. Sauvegarde de la base (section 1.b) — vérifier qu'un dump récent existe.
2. Dans Coolify → ressource *Authentik* → variable `AUTHENTIK_TAG` → nouvelle version
   stable (voir https://github.com/goauthentik/authentik/releases).
3. **Redeploy**. Le service `worker` applique les migrations de schéma au démarrage.
4. Contrôles post-mise à jour (section 6).

Équivalent en ligne de commande (si accès direct au compose Coolify) :
```bash
docker compose pull
docker compose up -d
```

## 6. Contrôles post-opération (mise à jour / redéploiement)

```bash
# Conteneurs sains
docker ps --format '{{.Names}}\t{{.Status}}' | grep -i authentik

# Aucun port sensible exposé publiquement
ss -tulpn | grep -E ':9000|:9443|:5432|:6379' | grep -vE '127\.0\.0\.1|::1' \
  && echo "!!! ATTENTION port expose" || echo "OK non expose"

# Réponse HTTPS via le proxy
curl -sS -o /dev/null -w "HTTP %{http_code}\n" https://auth.xp-nova.com/
```
+ vérifier dans le navigateur : login OK, certificat valide, MFA fonctionnel.

## 7. Retour arrière (rollback)

- **Mise à jour ratée** : remettre l'ancien `AUTHENTIK_TAG` dans Coolify et redéployer ;
  si le schéma a migré, restaurer le dump pré-mise à jour (section 4).
- **Suppression complète** : dans Coolify, *Stop* puis *Delete* la ressource Authentik.
  Cela n'affecte ni le proxy, ni Odoo, ni les autres sites. La route Traefik disparaît
  automatiquement.

## 8. Dépannage courant

| Symptôme | Piste |
|---|---|
| Certificat non émis | Vérifier que `auth.xp-nova.com` (A + AAAA) pointe vers le VPS ; si Cloudflare, passer en « DNS only » le temps de l'émission ; consulter les logs de `coolify-proxy`. |
| 502 / Bad Gateway | `authentik-server` pas encore *healthy* (migrations) ; attendre, puis vérifier les logs du service `server`. |
| Connexion impossible après activation MFA | Utiliser le compte `xpn-breakglass` ou les codes de récupération (hors VPS). |
| `server` unhealthy au démarrage | Normal quelques dizaines de secondes (migrations DB) ; persistant = vérifier connexion à `postgresql` / `redis`. |

## 9. Journal des interventions

| Date | Intervention | Par | Notes |
|---|---|---|---|
| 2026-08-14 | Installation initiale Authentik 2025.10.3 via Coolify | — | SSO auth.xp-nova.com, MFA en cours de configuration |
| | | | |
