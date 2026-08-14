#!/usr/bin/env bash
#
# authentik-backup.sh — Sauvegarde de la base PostgreSQL Authentik (déployée via Coolify)
#
# - Effectue un dump logique de la base "authentik"
# - Compresse (gzip) puis chiffre optionnellement (GPG symétrique)
# - Applique une rétention : 7 quotidiennes, 4 hebdomadaires, 3 mensuelles
# - Copie optionnelle hors VPS (rclone), si une destination est fournie
#
# AUCUN SECRET N'EST STOCKÉ EN CLAIR DANS CE SCRIPT.
# Le dump utilise la connexion socket locale du conteneur PostgreSQL
# (authentification "trust" en local dans l'image officielle postgres),
# donc aucun mot de passe n'a besoin d'être écrit ici.
#
# Installation :
#   sudo mkdir -p /opt/authentik-backups
#   sudo cp authentik-backup.sh /opt/authentik-backups/
#   sudo chmod 700 /opt/authentik-backups/authentik-backup.sh
#   Renseigner PG_CONTAINER ci-dessous (voir: docker ps | grep postgresql)
#
# Planification (cron root), tous les jours à 02h30 :
#   30 2 * * * /opt/authentik-backups/authentik-backup.sh >> /var/log/authentik-backup.log 2>&1

set -euo pipefail

########################################
# CONFIGURATION — à adapter
########################################

# Nom du conteneur PostgreSQL d'Authentik (géré par Coolify).
# Trouvez-le avec :  docker ps --format '{{.Names}}' | grep '^postgresql-'
# (le suffixe est l'UUID de service Coolify, stable tant que la ressource existe)
PG_CONTAINER="${PG_CONTAINER:-postgresql-m11wfp0wh0mj7wyq0jwdwpfi}"

PG_USER="authentik"
PG_DB="authentik"

# Répertoire racine des sauvegardes (sur le VPS)
BACKUP_ROOT="${BACKUP_ROOT:-/opt/authentik-backups}"

# Chiffrement optionnel : chemin d'un fichier contenant UNIQUEMENT la passphrase
# (chmod 600). Laisser vide pour désactiver le chiffrement.
#   Ex: echo 'ma-passphrase-forte' > /root/.authentik-backup-pass && chmod 600 /root/.authentik-backup-pass
GPG_PASSPHRASE_FILE="${GPG_PASSPHRASE_FILE:-}"

# Copie hors VPS optionnelle via rclone (laisser vide pour désactiver).
# Ex: "chiffre-remote:authentik-backups"  (configurez d'abord: rclone config)
RCLONE_REMOTE="${RCLONE_REMOTE:-}"

########################################
# LOGIQUE — ne pas modifier sans raison
########################################

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

DAILY_DIR="${BACKUP_ROOT}/daily"
WEEKLY_DIR="${BACKUP_ROOT}/weekly"
MONTHLY_DIR="${BACKUP_ROOT}/monthly"
mkdir -p "$DAILY_DIR" "$WEEKLY_DIR" "$MONTHLY_DIR"
chmod 700 "$BACKUP_ROOT" "$DAILY_DIR" "$WEEKLY_DIR" "$MONTHLY_DIR"

STAMP="$(date '+%Y-%m-%d-%H%M')"
BASENAME="authentik-${STAMP}.sql.gz"
DEST="${DAILY_DIR}/${BASENAME}"

# Vérifier que le conteneur tourne
if ! docker ps --format '{{.Names}}' | grep -qx "$PG_CONTAINER"; then
  log "ERREUR : conteneur PostgreSQL '$PG_CONTAINER' introuvable/arrêté."
  log "         Ajustez PG_CONTAINER (docker ps | grep postgresql)."
  exit 1
fi

log "Dump de la base '${PG_DB}' depuis le conteneur '${PG_CONTAINER}'..."
# pg_dump via socket local (trust) -> pas de mot de passe requis
docker exec "$PG_CONTAINER" pg_dump -U "$PG_USER" -d "$PG_DB" --clean --if-exists \
  | gzip -9 > "$DEST"

if [[ ! -s "$DEST" ]]; then
  log "ERREUR : le dump est vide, sauvegarde annulée."
  rm -f "$DEST"
  exit 1
fi
chmod 600 "$DEST"
log "Dump OK : $DEST ($(du -h "$DEST" | cut -f1))"

# Chiffrement optionnel
if [[ -n "$GPG_PASSPHRASE_FILE" && -f "$GPG_PASSPHRASE_FILE" ]]; then
  log "Chiffrement GPG symétrique..."
  gpg --batch --yes --pinentry-mode loopback \
      --passphrase-file "$GPG_PASSPHRASE_FILE" \
      --symmetric --cipher-algo AES256 \
      -o "${DEST}.gpg" "$DEST"
  chmod 600 "${DEST}.gpg"
  rm -f "$DEST"          # on ne garde que la version chiffrée
  DEST="${DEST}.gpg"
  BASENAME="${BASENAME}.gpg"
  log "Chiffré : $DEST"
fi

# Promotion hebdomadaire (dimanche) et mensuelle (1er du mois)
if [[ "$(date '+%u')" == "7" ]]; then
  cp -a "$DEST" "${WEEKLY_DIR}/${BASENAME}"
  log "Copie hebdomadaire créée."
fi
if [[ "$(date '+%d')" == "01" ]]; then
  cp -a "$DEST" "${MONTHLY_DIR}/${BASENAME}"
  log "Copie mensuelle créée."
fi

# Rétention : 7 quotidiennes / 4 hebdomadaires / 3 mensuelles
prune() {
  local dir="$1" keep="$2"
  # shellcheck disable=SC2012
  ls -1t "$dir"/authentik-*.sql.gz* 2>/dev/null | tail -n +"$((keep+1))" | while read -r f; do
    rm -f "$f" && log "Purge : $f"
  done
}
prune "$DAILY_DIR" 7
prune "$WEEKLY_DIR" 4
prune "$MONTHLY_DIR" 3

# Copie hors VPS optionnelle
if [[ -n "$RCLONE_REMOTE" ]] && command -v rclone >/dev/null 2>&1; then
  log "Envoi hors VPS via rclone vers ${RCLONE_REMOTE}..."
  rclone copy "$DEST" "${RCLONE_REMOTE}/daily/" --quiet
  log "Copie hors VPS terminée."
fi

log "Sauvegarde terminée avec succès."
