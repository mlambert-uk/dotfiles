# OPENSPEC:START
# OpenSpec shell completions configuration
if [ -d "/home/mark/.local/share/bash-completion/completions" ]; then
  for f in "/home/mark/.local/share/bash-completion/completions"/*; do
    [ -f "$f" ] && . "$f"
  done
fi
# OPENSPEC:END

# If not running interactively, don't do anything (leave this at the top of this file)
[[ $- != *i* ]] && return

# All the default Omarchy aliases and functions
# (don't mess with these directly, just overwrite them here!)
source ~/.local/share/omarchy/default/bash/rc

# Add your own exports, aliases, and functions here.
#
# Make an alias for invoking commands you use constantly
# alias p='python'
fastfetch

# uv
export PATH="/home/mark/.local/share/../bin:$PATH"


# Load Angular CLI autocompletion.
source <(ng completion script)

[[ "$TERM_PROGRAM" == "kiro" ]] && . "$(kiro --locate-shell-integration-path bash)"

export BW_SESSION="GjLbSSwWC8scZ8L8KfTSNLpBPAjMkFR96/wCYIaHyy2de7z7mHcwLDvooE7KRK9FiMZcK57WElFBiiT3odAQNw=="

function y() {
	local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
	yazi "$@" --cwd-file="$tmp"
	IFS= read -r -d '' cwd < "$tmp"
	[ -n "$cwd" ] && [ "$cwd" != "$PWD" ] && builtin cd -- "$cwd"
	rm -f -- "$tmp"
}

export CHROME_BIN="/usr/bin/chromium"
export PATH="$HOME/.local/bin:$PATH"

alias o="opencode"

# Added by LM Studio CLI (lms)
export PATH="$PATH:/home/mark/.lmstudio/bin"
# End of LM Studio CLI section

export CONFLUENCE_API_TOKEN="ATATT3xFfGF0J3sCSNRHHhHrnFZA10r-ybB1MExP6k98dfQVgUDQgqvcwNgfk18mKx1kUUcAK5BcteCuS8iQvqx2FCAPQFT6k4QvbJv13X9leQCvvgpxevgexYVM_uvlzRPy4YhJ-fFdQ5KU3gu3_wtxWb54fSWVzVBb683cYjXFpzfEXL2SGAM=279E8568"
export CONFLUENCE_BASE_URL="https://totd-ci.atlassian.net/wiki"
export CONFLUENCE_EMAIL="mark.lambert@halfords.co.uk"

export OUTLOOK_EMAIL="mark.lambert@halfords.co.uk"
export OUTLOOK_PASSWORD="ttdvbhnmjwrqsxpm"
