# dotfiles

## Restaurer

```sh
git clone <url> ~/Projets/dotfiles
mkdir -p ~/.config/fastfetch
ln -sf ~/Projets/dotfiles/fastfetch/config.jsonc ~/.config/fastfetch/config.jsonc
```

### Claude Code (Lagoon)

Thème de couleurs, barre de statut et mod « lagoon » (poisson à côté du spinner, accueil,
bulles sur les appels d’outils), aux couleurs de Lagoon et du widget Bowl.

```sh
ln -sfn ~/Projets/dotfiles/claude-code/themes ~/.claude/themes
ln -sf ~/Projets/dotfiles/claude-code/statusline-lagoon.sh ~/.claude/statusline-lagoon.sh
```

Puis dans `~/.claude/settings.json` :

```json
{
  "theme": "custom:lagoon",
  "statusLine": { "type": "command", "command": "~/.claude/statusline-lagoon.sh", "padding": 0, "refreshInterval": 1 },
  "spinnerVerbs": { "mode": "replace", "verbs": ["Drifting", "Snorkeling", "Riding the swell", "…"] },
  "env": { "CLAUDE_CODE_PLUGIN_DIRS": "~/Projets/dotfiles/claude-code/mods/lagoon" }
}
```

La barre de statut demande `jq` et une police Nerd Font.
