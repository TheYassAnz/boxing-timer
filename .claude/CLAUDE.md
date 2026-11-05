# Boxing Timer — Guide Claude Code

## Stack

- **Framework** : Expo SDK 58 (React Native 0.88) + Expo Router 58 (file-based routing)
- **UI** : composants natifs `@expo/ui` (SwiftUI sur iOS, Jetpack Compose / Material 3 sur Android) + NativeWind v4 pour la mise en page. Gluestack est retiré.
- **Langage** : TypeScript strict
- **React** : 19.3 avec React Compiler activé (experimental)
- **New Architecture** seule architecture (le champ `newArchEnabled` n'existe plus)
- **Tabs** : `NativeTabs` depuis `expo-router/native-tabs` (Label/Icon/VectorIcon en sous-composants de `Trigger`)
- **Animations** : @legendapp/motion (utilisé — transitions de phase, pulsation 10s). `Motion.View` sans `className` : mettre les styles sur un `View` enfant
- **Anneau** : react-native-svg (`components/timer/ProgressRing.tsx`)
- **Haptiques** : expo-haptics (utilisé — alerte 10s + fin de phase)
- **Audio** : expo-audio via `useSound` — cloche `assets/sounds/boxing_bell.wav`, claquoir `assets/sounds/clapper.wav` (synthétisé, voir `assets/sounds/CREDITS.md`)
- **Keep-awake** : expo-keep-awake (utilisé — actif sur l'écran Timer)
- **Timer** : machine à états pure basée sur des timestamps (`components/timer/machine.ts`), testée avec `npm test` (node:test via tsx)
- **Persistance** : @react-native-async-storage/async-storage (clé `boxing-timer-config`)

## Structure du projet

```
app/
  _layout.tsx          # Root layout — Stack + global.css
  (tabs)/
    _layout.tsx        # NativeTabs, teinte d'accent = rouge de la palette
    index.tsx          # Écran Timer (tab principale)
    community.tsx      # Tab Community — en développement
assets/sounds/         # boxing_bell.wav, clapper.wav, CREDITS.md
components/
  native/              # Contrôles natifs @expo/ui : *.ios.tsx / *.android.tsx + *.d.ts (props partagées)
    PresetPicker, RoundButton, SettingsList
  timer/
    index.tsx          # Écran Timer
    config.ts          # Config, DEFAULTS, LIMITS, PRESETS, UNLIMITED, parseConfig, formatage
    machine.ts         # Machine à états pure (start/pause/resume/tick) + machine.test.ts
    theme.ts           # Palette système (usePalette(phase)), rouge d'accent, vert au repos
    ProgressRing.tsx   # Anneau de progression SVG
hooks/
  useBoxingTimer.ts    # Machine sur React (tick 250 ms, cloche, claquoir, haptiques) : useBoxingTimer(config, { bell, clap })
  useSound.ts          # Lecture d'un son (expo-audio)
  useStoredConfig.ts   # Config persistée (AsyncStorage)
```

## Conventions de code

- **Styles** : NativeWind via `className` pour la mise en page ; couleurs inline depuis `usePalette` (`components/timer/theme.ts`). Ne jamais utiliser `StyleSheet.create`.
- **Composants natifs** : contrôles interactifs dans `components/native/*.ios.tsx` / `*.android.tsx`, rendus dans un `Host` `@expo/ui`, props typées dans un `.d.ts` commun. Ne pas réinventer.
- **Lancement** : Expo Go sur iPhone (`@expo/ui` y est embarqué) — pas de dev build ni de lib à code natif tiers.
- **Icônes** : `@expo/vector-icons` — MaterialCommunityIcons en priorité (cohérence avec la nav).
- **Imports** : alias `@/` pour la racine du projet (configuré dans tsconfig + babel).
- **Pas de commentaires** sauf si le WHY est non-évident.
- **Pas de mock de fonctionnalités** : préférer des vraies implémentations.

## Comportement spécifique boxing timer

- Préréglages (raccourcis qui remplissent les réglages, sans lien ensuite) : **Échauffement** (illimité, 30 s, 30 s), **Assauts** (illimité, 1:30, 0:35), **Sparring** (12, 3:00, 1:00). Rounds illimités : `Config.rounds = UNLIMITED` (`0`), jamais de phase `done`.
- Défauts : **3 rounds**, **180s** par round, **60s** de repos.
- Plages autorisées : rounds 1–100 ou illimité, durée 1–300s, repos 1–300s.
- L'ordre des phases : `idle → round → rest → round → … → done`
- Les alertes haptiques se déclenchent **10 secondes avant** la fin de chaque phase.
- Le son de cloche se joue au **démarrage** et à chaque **changement de phase**.
- Le claquoir (`clapper.wav`) joue au passage des 10 dernières secondes de chaque round (un seul clip à la marque des 10 s, pas pendant le repos).
- Boutons : Réinitialiser (« Réinit. ») et Pause/Reprendre ~80 pt, Démarrer ~96 pt.
- La config est persistée via AsyncStorage et rechargée au mount.

## Quirks connus

- **Temps** : la fin de chaque phase est un timestamp (`endsAt`). `tick()` enchaîne les phases à partir de la deadline précédente, pas de `Date.now()`, pour rattraper exactement le temps passé en arrière-plan. Ne pas décrémenter un compteur à chaque tick.

## Ce qu'il NE faut PAS faire

- La tab Community est en cours de développement (voir PROGRESS.md).
- Ne pas utiliser `alert()` — feedbacks visuels/haptiques uniquement.
- Ne pas ajouter de gestion d'état globale (Redux, Zustand) — `useState` suffit.
- Ne pas publier sur l'App Store — usage personnel uniquement.

## Commandes utiles

```bash
npm start          # Démarre Expo (scan QR code)
npm run ios        # Simulateur iOS
npm run android    # Émulateur Android
npm run lint       # ESLint
npm test           # Tests de la machine à états (node:test)
```

## Plateforme cible

iOS et Android en parité. Pas de Web comme priorité.
