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

function y() {
	local tmp="$(mktemp -t "yazi-cwd.XXXXXX")" cwd
	yazi "$@" --cwd-file="$tmp"
	IFS= read -r -d '' cwd < "$tmp"
	[ -n "$cwd" ] && [ "$cwd" != "$PWD" ] && builtin cd -- "$cwd"
	rm -f -- "$tmp"
}

export CHROME_BIN="/usr/bin/chromium"
export KIRO_BIN="/home/mark/.local/share/Kiro"
export PATH="$HOME/.local/bin:$PATH:$KIRO_BIN"

alias o="opencode"

# Added by LM Studio CLI (lms)
export PATH="$PATH:/home/mark/.lmstudio/bin"
# End of LM Studio CLI section

source ~/.secrets

# Load environment variables from ~/.env
if [ -f ~/.env ]; then
    export $(grep -v '^#' ~/.env | xargs)
fi

export PATH="$HOME/scripts:$PATH"
export PATH="$PATH:$HOME/.local/bin"

# kiro-cli shortcuts
alias k='kiro-cli'
alias kc='kiro-cli chat'

# ZED Edutir shortcuts
alias zed='zeditor'

# Govee CLI
export PATH="$HOME/Code/govee-cli/.venv/bin:$PATH"
