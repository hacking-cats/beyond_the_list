#!/bin/sh
# Claude Code PreToolUse hook (Bash): block commits on main and pushes to main.
# Exit code 2 blocks the tool call and shows the message to Claude.
input=$(cat)
cmd=$(printf '%s' "$input" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\(.*\)".*/\1/p')

case "$cmd" in
  *"git commit"*|*"git merge"*|*"git cherry-pick"*|*"git rebase"*)
    branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    if [ "$branch" = "main" ]; then
      echo "Blocked: you are on main. Create a branch (git switch -c feat/<issue>-<slug>) and open a pull request. See AGENTS.md > Git rules." >&2
      exit 2
    fi
    ;;
esac

case "$cmd" in
  *"git push"*)
    if printf '%s' "$cmd" | grep -Eq '(^|[[:space:]:])main([[:space:]]|$)|refs/heads/main|--no-verify'; then
      echo "Blocked: pushing to main (or skipping hooks) is not allowed. Push your feat/ branch and open a pull request. See AGENTS.md > Git rules." >&2
      exit 2
    fi
    if [ "$(git rev-parse --abbrev-ref HEAD 2>/dev/null)" = "main" ]; then
      echo "Blocked: you are on main. Push a feat/ branch and open a pull request." >&2
      exit 2
    fi
    ;;
esac
exit 0
