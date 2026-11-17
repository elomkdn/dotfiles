# dotfiles

## Restaurer

```sh
git clone https://github.com/elomkdn/dotfiles.git ~/Projets/dotfiles
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

#### Le mod seul

Pour installer seulement le mod « lagoon », sans cloner ce dépôt, dans une session Claude Code :

```
/plugin install lagoon --marketplace elomkdn/dotfiles
```

Répondre `y` pour ajouter la source, puis choisir la portée (utilisateur, la première). Depuis un
shell : `claude plugin install lagoon --marketplace elomkdn/dotfiles`. Dans l’application de
bureau, où `/plugin` n’existe pas : + à côté de la zone de saisie, Plugins, Add marketplace avec
`elomkdn/dotfiles`, puis Add plugin.

Le mod va avec le thème `custom:lagoon` ci-dessus, mais marche sans.
