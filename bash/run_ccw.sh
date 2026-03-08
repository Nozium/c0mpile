#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ISSUES_DIR="$REPO_ROOT/docs/issues"
LOG_DIR="$REPO_ROOT/log"

usage() {
  cat <<'USAGE'
Usage:
  bash/run_ccw.sh [all|phase1|phase2|phase3|phase4|phase1:01|phase3:02 ...] [--send] [--print] [--run-log NAME]

Examples:
  bash/run_ccw.sh
  bash/run_ccw.sh phase1 --print
  bash/run_ccw.sh phase1 phase2 --send
  bash/run_ccw.sh phase3:02 --send              # run only P3-2 (Virtual Staff)
  bash/run_ccw.sh phase3:01 phase3:02 --send    # run P3-1 and P3-2
  bash/run_ccw.sh all --send --run-log ccw_phase_batch_01

Behavior:
  - default: prepares prompts for all phases and shows where they were written
  - phase:NN: run only the specified issue (e.g. phase3:02 = 02_*.md from phase3)
  - --print: prints the generated prompt body to stdout
  - --send: runs `claude --remote "<phase prompt>"` for each selected phase
  - --run-log: writes execution output to `log/<NAME>.log` and branch candidates to `log/<NAME>.branches.txt`
USAGE
}

log() {
  printf '%s\n' "$*" >&2
}

timestamp_compact() {
  date '+%Y%m%d_%H%M%S'
}

timestamp_iso() {
  date '+%Y-%m-%dT%H:%M:%S%z'
}

phase_exists() {
  [ -d "$ISSUES_DIR/$1" ]
}

build_phase_prompt() {
  local phase="$1"
  local issue_filter="${2:-}"  # optional: "02" to filter to 02_*.md only
  local phase_dir="$ISSUES_DIR/$phase"
  local readme="$phase_dir/README.md"
  local file

  if ! phase_exists "$phase"; then
    log "Unknown phase: $phase"
    return 1
  fi

  if [ -n "$issue_filter" ]; then
    printf 'BONSAI の %s issue %s を CCW 向けに共有します。\n' "$phase" "$issue_filter"
  else
    printf 'BONSAI の %s issue を CCW 向けに共有します。\n' "$phase"
  fi
  printf '以下は docs/issues/%s 配下の source of truth です。\n' "$phase"
  printf '確定事項は維持し、未確定事項は未確定のまま扱ってください。\n'
  printf 'issue の意図・依存関係・受け入れ条件を崩さず、この phase の実装整理と着手に使ってください。\n\n'
  printf '## File: docs/issues/%s/README.md\n\n' "$phase"
  cat "$readme"

  for file in "$phase_dir"/*.md; do
    if [ "$(basename "$file")" = "README.md" ]; then
      continue
    fi

    # If issue_filter is set, only include matching files (e.g. "02" matches "02_*.md")
    if [ -n "$issue_filter" ]; then
      case "$(basename "$file")" in
        "${issue_filter}"_*) ;;
        *) continue ;;
      esac
    fi

    printf '\n\n## File: docs/issues/%s/%s\n\n' "$phase" "$(basename "$file")"
    cat "$file"
  done
}

write_prompt_file() {
  local phase="$1"
  local issue_filter="${2:-}"
  local prompt_file
  if [ -n "$issue_filter" ]; then
    prompt_file="/tmp/run_ccw.${phase}_${issue_filter}.prompt.txt"
  else
    prompt_file="/tmp/run_ccw.${phase}.prompt.txt"
  fi

  build_phase_prompt "$phase" "$issue_filter" > "$prompt_file"
  printf '%s\n' "$prompt_file"
}

extract_branch_candidates() {
  local source_file="$1"

  {
    grep -Eo 'refs/(heads|remotes)/[A-Za-z0-9._/-]+' "$source_file" || true
    grep -Eo '(origin|upstream)/[A-Za-z0-9._/-]+' "$source_file" || true
    sed -nE 's/.*[Bb]ranch(es)?[^A-Za-z0-9._/-]+(([A-Za-z0-9._-]+\/)+[A-Za-z0-9._-]+).*/\2/p' "$source_file" || true
  } | sort -u
}

sanitize_capture() {
  local source_file="$1"
  local target_file="$2"

  if [ -f "$source_file" ]; then
    perl -pe 's/\r//g; s/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]//g; s/\x04//g' "$source_file" > "$target_file"
  else
    : > "$target_file"
  fi
}

append_run_header() {
  {
    printf 'run_log=%s\n' "$RUN_LOG"
    printf 'created_at=%s\n' "$(timestamp_iso)"
    printf 'repo_root=%s\n' "$REPO_ROOT"
    printf 'phases=%s\n' "${PHASES[*]}"
    printf 'send=%s\n' "$SEND"
    printf 'print=%s\n\n' "$PRINT"
  } >> "$LOG_FILE"
}

run_remote_phase() {
  local phase="$1"
  local prompt_file="$2"
  local phase_capture="/tmp/run_ccw.${RUN_LOG}.${phase}.raw.log"
  local phase_clean="/tmp/run_ccw.${RUN_LOG}.${phase}.clean.log"
  local helper_script="/tmp/run_ccw.${RUN_LOG}.${phase}.command.sh"
  local status_file="/tmp/run_ccw.${RUN_LOG}.${phase}.status"
  local status="1"
  local branches=""
  local used_script="0"

  rm -f "$phase_capture" "$phase_clean" "$helper_script" "$status_file"

  {
    printf '\n===== PHASE %s START %s =====\n' "$phase" "$(timestamp_iso)"
    printf 'prompt_file=%s\n' "$prompt_file"
  } | tee -a "$LOG_FILE" >&2

  cat > "$helper_script" <<EOF_HELPER
#!/usr/bin/env bash
set -uo pipefail
prompt_file="\$1"
status_file="\$2"
cd "$REPO_ROOT"
claude --remote "\$(cat "\$prompt_file")"
status=\$?
printf '%s\n' "\$status" > "\$status_file"
exit "\$status"
EOF_HELPER
  chmod +x "$helper_script"

  if command -v script >/dev/null 2>&1; then
    used_script="1"
    if ! script -q "$phase_capture" "$helper_script" "$prompt_file" "$status_file"; then
      :
    fi
  else
    if ! /bin/bash "$helper_script" "$prompt_file" "$status_file" > "$phase_capture" 2>&1; then
      :
    fi
  fi

  if [ -f "$status_file" ]; then
    status="$(cat "$status_file")"
  fi

  sanitize_capture "$phase_capture" "$phase_clean"

  if [ "$used_script" -eq 0 ]; then
    cat "$phase_clean"
  fi

  {
    printf '\n===== PHASE %s RAW OUTPUT =====\n' "$phase"
    cat "$phase_clean"
    printf '\n===== PHASE %s END status=%s %s =====\n' "$phase" "$status" "$(timestamp_iso)"
  } >> "$LOG_FILE"

  branches="$(extract_branch_candidates "$phase_clean" || true)"

  {
    printf '===== HARVEST_BRANCHES %s =====\n' "$phase"
    if [ -n "$branches" ]; then
      printf '%s\n' "$branches"
    else
      printf '(none detected)\n'
    fi
    printf '===== END HARVEST_BRANCHES %s =====\n' "$phase"
  } | tee -a "$LOG_FILE" >&2

  if [ -n "$branches" ]; then
    while IFS= read -r branch; do
      [ -n "$branch" ] || continue
      printf '%s %s\n' "$phase" "$branch" >> "$BRANCH_SUMMARY_FILE"
    done <<EOF_BRANCHES
$branches
EOF_BRANCHES
  else
    printf '%s %s\n' "$phase" '(none detected)' >> "$BRANCH_SUMMARY_FILE"
  fi

  rm -f "$phase_capture" "$phase_clean" "$helper_script" "$status_file"
  [ "$status" -eq 0 ]
}

SEND=0
PRINT=0
RUN_LOG="ccw_$(timestamp_compact)"
PHASES=()
# Parallel arrays: PHASE_NAMES[i] = phase name, ISSUE_FILTERS[i] = issue number or ""
PHASE_NAMES=()
ISSUE_FILTERS=()

while [ "$#" -gt 0 ]; do
  case "$1" in
    --send)
      SEND=1
      ;;
    --print)
      PRINT=1
      ;;
    --run-log)
      shift
      if [ "$#" -eq 0 ]; then
        log "Missing value for --run-log"
        exit 1
      fi
      RUN_LOG="$1"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    all)
      PHASE_NAMES=(phase1 phase2 phase3 phase4)
      ISSUE_FILTERS=("" "" "" "")
      ;;
    phase[1-4]:*)
      # e.g. phase3:02 -> phase=phase3, filter=02
      local_phase="${1%%:*}"
      local_filter="${1##*:}"
      PHASE_NAMES+=("$local_phase")
      ISSUE_FILTERS+=("$local_filter")
      ;;
    phase1|phase2|phase3|phase4)
      PHASE_NAMES+=("$1")
      ISSUE_FILTERS+=("")
      ;;
    *)
      log "Unknown argument: $1"
      usage
      exit 1
      ;;
  esac
  shift
done

# Back-compat: populate PHASES for header logging
PHASES=("${PHASE_NAMES[@]}")

RUN_LOG="${RUN_LOG%.log}"
LOG_FILE="$LOG_DIR/${RUN_LOG}.log"
BRANCH_SUMMARY_FILE="$LOG_DIR/${RUN_LOG}.branches.txt"

if [ "${#PHASE_NAMES[@]}" -eq 0 ]; then
  PHASE_NAMES=(phase1 phase2 phase3 phase4)
  ISSUE_FILTERS=("" "" "" "")
  PHASES=("${PHASE_NAMES[@]}")
fi

if [ "$SEND" -eq 1 ] && ! command -v claude >/dev/null 2>&1; then
  log "`claude` command not found in PATH"
  exit 1
fi

mkdir -p "$LOG_DIR"
: > "$LOG_FILE"
: > "$BRANCH_SUMMARY_FILE"
append_run_header

cd "$REPO_ROOT"

overall_status=0

for idx in "${!PHASE_NAMES[@]}"; do
  phase="${PHASE_NAMES[$idx]}"
  issue_filter="${ISSUE_FILTERS[$idx]}"
  if [ -n "$issue_filter" ]; then
    run_label="${phase}:${issue_filter}"
  else
    run_label="$phase"
  fi

  prompt_file="$(write_prompt_file "$phase" "$issue_filter")"
  log "Prepared $run_label prompt: $prompt_file"
  printf 'phase=%s issue_filter=%s prompt_file=%s\n' "$phase" "$issue_filter" "$prompt_file" >> "$LOG_FILE"

  if [ "$PRINT" -eq 1 ]; then
    printf '===== %s =====\n' "$run_label"
    cat "$prompt_file"
    printf '\n'
  fi

  if [ "$SEND" -eq 1 ]; then
    log "Sending $run_label to CCW via claude --remote"
    if ! run_remote_phase "$run_label" "$prompt_file"; then
      overall_status=1
      log "Phase $run_label finished with a non-zero status. See $LOG_FILE"
    fi
  else
    log "Dry run for $run_label: add --send to execute"
  fi
done

log "Run log written to $LOG_FILE"
log "Branch summary written to $BRANCH_SUMMARY_FILE"
exit "$overall_status"
