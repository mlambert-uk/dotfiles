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
