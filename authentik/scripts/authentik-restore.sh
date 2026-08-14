#!/usr/bin/env bash
#
# authentik-restore.sh — Restauration d'un dump PostgreSQL Authentik
#
# ⚠️  À UTILISER AVEC PRUDENCE : écrase les données de la base "authentik".
#     Testez de préférence dans un environnement séparé avant la production.
#
# Usage :
#   ./authentik-restore.sh /opt/authentik-backups/daily/authentik-2026-08-14-0230.sql.gz
#   ./authentik-restore.sh /chemin/vers/dump.sql.gz.gpg   (déchiffrement auto si .gpg)

set -euo pipefail

PG_CONTAINER="${PG_CONTAINER:-postgresql-m11wfp0wh0mj7wyq0jwdwpfi}"
PG_USER="authentik"
PG_DB="authentik"
GPG_PASSPHRASE_FILE="${GPG_PASSPHRASE_FILE:-}"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

FILE="${1:-}"
[[ -z "$FILE" || ! -f "$FILE" ]] && { echo "Usage: $0 <fichier-dump.sql.gz[.gpg]>"; exit 1; }

if ! docker ps --format '{{.Names}}' | grep -qx "$PG_CONTAINER"; then
  log "ERREUR : conteneur '$PG_CONTAINER' introuvable."; exit 1
fi

read -r -p "Confirmer la restauration dans la base '$PG_DB' (écrase les données) ? [oui/NON] " ans
[[ "$ans" == "oui" ]] || { log "Annulé."; exit 0; }

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

case "$FILE" in
  *.gpg)
    [[ -f "$GPG_PASSPHRASE_FILE" ]] || { log "ERREUR : GPG_PASSPHRASE_FILE requis pour un .gpg"; exit 1; }
    log "Déchiffrement..."
    gpg --batch --yes --pinentry-mode loopback --passphrase-file "$GPG_PASSPHRASE_FILE" \
        -o "$TMP" -d "$FILE"
    gunzip -c "$TMP" | docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB"
    ;;
  *.gz)
    gunzip -c "$FILE" | docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB"
    ;;
  *)
    docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" < "$FILE"
    ;;
esac

log "Restauration terminée. Redémarrez la ressource Authentik dans Coolify (server + worker)."
