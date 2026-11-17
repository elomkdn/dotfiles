#!/usr/bin/env bash
# Lagoon status line for Claude Code: a teal pill with the model, then the folder,
# the git branch, the context window with the fish and the 5-hour quota as a water gauge. Colors follow
# the Bowl widget's water: teal, yellow from 50 %, peach from 75 %, red from 90 %.
# Needs a Nerd Font and jq.

input=$(cat)
IFS=$'\t' read -r model dir pct quota < <(jq -r '[
  (.model.display_name // "Claude"),
  (.workspace.current_dir // .cwd // ""),
  (.context_window.used_percentage | if . == null then "-" else (floor | tostring) end),
  (.rate_limits.five_hour.used_percentage | if . == null then "-" else (floor | tostring) end)
] | @tsv' <<<"$input")

# Catppuccin Mocha, as in Lagoon
rgb() { printf '\e[38;2;%sm' "$1"; }
on()  { printf '\e[48;2;%sm' "$1"; }
TEAL='148;226;213' CRUST='17;17;27' SUB1='186;194;222' OV0='108;112;134'
SURF1='69;71;90' MAUVE='203;166;247' PEACH='250;179;135' YELLOW='249;226;175' RED='243;139;168'
R=$'\e[0m'

WAVES=$'\U000F078D' FOLDER=$'\U000F024B' BRANCH=$'' DROP=$'\U000F058C'
FISH=$'\U000F023A'
CAP_L=$'' CAP_R=$''
SEP="$(rgb "$OV0") · $R"

# A share used, 0-100, to the Bowl widget's water color (c) and a lighter shimmer (s)
level() {
  if   (( $1 < 50 )); then c=$TEAL   s='196;240;233'
  elif (( $1 < 75 )); then c=$YELLOW s='252;240;214'
  elif (( $1 < 90 )); then c=$PEACH  s='252;214;190'
  else c=$RED s='249;191;207'; fi
}

# The pill
out="$(rgb "$TEAL")$CAP_L$(on "$TEAL")$(rgb "$CRUST")"$'\e[1m'"$WAVES $model"$'\e[22m'"$R$(rgb "$TEAL")$CAP_R$R"

# Folder
if [[ -n $dir ]]; then
  name=${dir/#$HOME/\~}; name=${name##*/}; [[ -z $name ]] && name='~'
  [[ $dir == "$HOME" ]] && name='~'
  out+=" $(rgb "$TEAL")$FOLDER $(rgb "$SUB1")$name$R"
fi

# Git branch, with a peach dot when there are uncommitted changes
if [[ -n $dir ]] && branch=$(git -C "$dir" branch --show-current 2>/dev/null) && [[ -n $branch ]]; then
  out+="$SEP$(rgb "$MAUVE")$BRANCH $branch$R"
  [[ -n $(git -C "$dir" --no-optional-locks status --porcelain --untracked-files=no 2>/dev/null | head -c1) ]] \
    && out+=" $(rgb "$PEACH")●$R"
fi

# Context window: the fish
if [[ $pct != - ]]; then
  level "$pct"
  out+="$SEP$(rgb "$c")$FISH $pct%$R"
fi

# The 5-hour quota, as in the Bowl widget (subscribers only): the lagoon fills up
if [[ $quota != - ]]; then
  level "$quota"
  cells=8 full=$(( (quota * 8 + 50) / 100 )); (( full > cells )) && full=$cells
  # A ripple runs along the water, one cell per second (refreshInterval: 1),
  # then rests for three seconds before the next one
  ripple=$(( ${EPOCHSECONDS:-$(date +%s)} % (full + 3) ))
  bar=''
  for ((i = 0; i < full; i++)); do
    if (( i == ripple )); then bar+="$(rgb "$s")━"; else bar+="$(rgb "$c")━"; fi
  done
  bar+="$(rgb "$SURF1")"; for ((i = full; i < cells; i++)); do bar+='━'; done
  out+="$SEP$(rgb "$c")$DROP $bar $(rgb "$c")$quota%$R"
fi

printf '%s' "$out"
