# Charte graphique — Boxing Timer

Direction B : composants natifs (`@expo/ui`), couleurs système claires/sombres selon le téléphone, **une seule couleur d'accent : le rouge**. Source de vérité des valeurs : `components/timer/theme.ts` (`usePalette(phase)`).

## Palette

| Rôle | iOS clair | iOS sombre | Android clair | Android sombre |
|---|---|---|---|---|
| Fond (`bg`) | `#FFFFFF` | `#000000` | `#FEF7FF` | `#141218` |
| Fond groupé (`groupedBg`, écran réglages) | `#F2F2F7` | `#000000` | `#FEF7FF` | `#141218` |
| Texte | `#000000` | `#FFFFFF` | `#1D1B20` | `#E6E0E9` |
| Texte secondaire | `#8E8E93` | `#8E8E93` | `#49454F` | `#CAC4D0` |
| Accent rouge (round, boutons) | `#FF3B30` | `#FF453A` | `#B3261E` | `#FF5449` |
| Vert (repos) | `#34C759` | `#30D158` | `#146C2E` | `#7DDB8A` |
| Piste de l'anneau | `#E5E5EA` | `#2C2C2E` | `#E6E0E9` | `#36343B` |
| Neutre (bouton Réinit.) | `#8E8E93` | `#8E8E93` | `#E6E0E9` | `#36343B` |

Les valeurs sont des copies hex fixes des couleurs système (pas `PlatformColor`) : l'anneau SVG et les boutons ronds teintés avec alpha exigent du hex.

L'accent vaut le rouge pendant le round et le vert pendant le repos (`phase === "rest"`). Aucune autre couleur.

## Typographie

- Police système, pas de police custom.
- Chiffres du timer : `text-8xl`, `font-extralight`, `tabular-nums` (les chiffres ne bougent pas).
- Titre « Timer » : 34 pt, bold. Libellé de phase (« Round 2 / 12 », « Round 7 », « Repos ») : `text-xl` semibold, texte secondaire.

## Boutons

- Ronds, natifs : **Démarrer 96 pt**, **Réinit. et Pause/Reprendre 80 pt** (pensés pour des mains nues et rapides).
- Réinit. à gauche (neutre), Pause/Reprendre à droite (accent). Séance terminée : seul le bouton d'accent « Réinit. » reste, à droite. Appui simple, sans confirmation.
- Composants dans `components/native/` (`RoundButton`, `PresetPicker`, `SettingsList`), variantes `.ios.tsx` / `.android.tsx`.

## Mise en page

- NativeWind (`className`) pour les conteneurs et espacements ; couleurs inline depuis la palette ; jamais de `StyleSheet.create`.
- Padding horizontal d'écran `px-4`, anneau de progression `ProgressRing` (SVG) en couleur d'accent.

## Animations

`@legendapp/motion` : fondu + glissement 150 ms au changement de phase, pulsation (scale 1.03) sur les 10 dernières secondes, avec vibration et claquoir.

## Iconographie

MaterialCommunityIcons (navigation et Community), couleur alignée sur la palette.
