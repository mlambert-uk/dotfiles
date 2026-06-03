#!/usr/bin/env bash
# nas-backup.sh — Back up key home directories to NAS via SMB
# NAS: smb://192.168.1.135/home/mark/backups
#
# Credentials file: ~/.config/nas-backup/credentials
# Format:
#   username=your_nas_username
#   password=your_nas_password
#
# Log: ~/.local/share/nas-backup/nas-backup.log

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

NAS_HOST="192.168.1.135"
NAS_SHARE="home"          # SMB share name on the NAS
NAS_SUBPATH="mark/backups/zombie-arch"  # path within the share
MOUNT_POINT="/mnt/nas-backup"
CREDS_FILE="${HOME}/.config/nas-backup/credentials"
LOG_DIR="${HOME}/.local/share/nas-backup"
LOG_FILE="${LOG_DIR}/nas-backup.log"
LOG_MAX_LINES=1000

# Directories to back up: "source|dest_name"
declare -a BACKUP_JOBS=(
    "${HOME}/dotfiles|dotfiles"
    "${HOME}/Documents|Documents"
    "${HOME}/Pictures|Pictures"
    "${HOME}/Wallpapers|Wallpapers"
    "${HOME}/Code|Code"
)

# rsync exclusions applied to every backup job
declare -a COMMON_EXCLUDES=(
    "--exclude=node_modules/"
    "--exclude=*.pyc"
    "--exclude=__pycache__/"
    "--exclude=.git/objects/"
)

# Additional exclusions for Code (large regenerable build artefacts)
declare -a CODE_EXCLUDES=(
    "--exclude=PAI/"
    "--exclude=target/"
    "--exclude=.venv/"
    "--exclude=venv/"
    "--exclude=dist/"
    "--exclude=build/"
    "--exclude=.next/"
    "--exclude=.nuxt/"
)

# Exclusions for Documents (items managed by their own sync)
declare -a DOCUMENTS_EXCLUDES=(
    "--exclude=mlambert_uk/"
    "--exclude=mlambert_uk_bak/"
)

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

mkdir -p "${LOG_DIR}"

log() {
    local level="$1"; shift
    local msg="$*"
    local timestamp
    timestamp="$(date '+%Y-%m-%d %H:%M:%S')"
    echo "[${timestamp}] [${level}] ${msg}" | tee -a "${LOG_FILE}"
}

rotate_log() {
    if [[ -f "${LOG_FILE}" ]]; then
        local line_count
        line_count="$(wc -l < "${LOG_FILE}")"
        if (( line_count > LOG_MAX_LINES )); then
            tail -n "${LOG_MAX_LINES}" "${LOG_FILE}" > "${LOG_FILE}.tmp"
            mv "${LOG_FILE}.tmp" "${LOG_FILE}"
        fi
    fi
}

# ---------------------------------------------------------------------------
# Pre-flight checks
# ---------------------------------------------------------------------------

check_credentials() {
    if [[ ! -f "${CREDS_FILE}" ]]; then
        log "ERROR" "Credentials file not found: ${CREDS_FILE}"
        log "ERROR" "Create it with: username=... and password=... (chmod 600)"
        exit 1
    fi
    local perms
    perms="$(stat -c '%a' "${CREDS_FILE}")"
    if [[ "${perms}" != "600" ]]; then
        log "WARN" "Credentials file permissions are ${perms}, expected 600 — fixing"
        chmod 600 "${CREDS_FILE}"
    fi
}

check_network() {
    if ! ping -c 1 -W 3 "${NAS_HOST}" &>/dev/null; then
        log "ERROR" "NAS at ${NAS_HOST} is unreachable — aborting"
        exit 1
    fi
}

# ---------------------------------------------------------------------------
# Mount management
# ---------------------------------------------------------------------------

ensure_mounted() {
    if mountpoint -q "${MOUNT_POINT}"; then
        log "INFO" "NAS already mounted at ${MOUNT_POINT}"
        return 0
    fi

    log "INFO" "Mounting //${NAS_HOST}/${NAS_SHARE} at ${MOUNT_POINT}"

    if [[ ! -d "${MOUNT_POINT}" ]]; then
        log "INFO" "Creating mountpoint ${MOUNT_POINT}"
        sudo mkdir -p "${MOUNT_POINT}"
    fi

    sudo mount -t cifs \
        "//${NAS_HOST}/${NAS_SHARE}" \
        "${MOUNT_POINT}" \
        --options "credentials=${CREDS_FILE},uid=$(id -u),gid=$(id -g),file_mode=0644,dir_mode=0755,vers=3.0"

    log "INFO" "Mount successful"
}

# ---------------------------------------------------------------------------
# Backup logic
# ---------------------------------------------------------------------------

run_rsync() {
    local src="$1"
    local dest_name="$2"
    local dest="${MOUNT_POINT}/${NAS_SUBPATH}/${dest_name}"
    local extra_args=("${@:3}")

    if [[ ! -d "${src}" ]]; then
        log "WARN" "Source not found, skipping: ${src}"
        return 0
    fi

    mkdir -p "${dest}"

    log "INFO" "Syncing ${src} → ${dest}"
    rsync -av --delete --human-readable --inplace --no-links \
        "${extra_args[@]+"${extra_args[@]}"}" \
        "${src}/" \
        "${dest}/" \
        2>&1 | tee -a "${LOG_FILE}"

    log "INFO" "Completed: ${dest_name}"
}

# ---------------------------------------------------------------------------
# Cleanup trap
# ---------------------------------------------------------------------------

cleanup() {
    local exit_code=$?
    if (( exit_code != 0 )); then
        log "ERROR" "Backup finished with errors (exit code ${exit_code})"
    else
        log "INFO" "Backup completed successfully"
    fi
}

trap cleanup EXIT

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

rotate_log
log "INFO" "========== NAS backup started =========="

check_credentials
check_network
ensure_mounted

failed=0

for job in "${BACKUP_JOBS[@]}"; do
    src="${job%%|*}"
    dest_name="${job##*|}"

    case "${dest_name}" in
        Code)
            run_rsync "${src}" "${dest_name}" \
                "${COMMON_EXCLUDES[@]}" "${CODE_EXCLUDES[@]}" || failed=1
            ;;
        Documents)
            run_rsync "${src}" "${dest_name}" \
                "${COMMON_EXCLUDES[@]}" "${DOCUMENTS_EXCLUDES[@]}" || failed=1
            ;;
        *)
            run_rsync "${src}" "${dest_name}" \
                "${COMMON_EXCLUDES[@]}" || failed=1
            ;;
    esac
done

if (( failed )); then
    log "ERROR" "One or more backup jobs failed — check log above"
    exit 1
fi
