# Boxing Timer — Guide Claude Code

## Stack

- **Framework** : Expo SDK 58 (React Native 0.88) + Expo Router 58 (file-based routing)
- **UI** : NativeWind v4 (Tailwind CSS) + Gluestack UI v3
- **Langage** : TypeScript strict
- **React** : 19.3 avec React Compiler activé (experimental)
- **New Architecture** seule architecture (le champ `newArchEnabled` n'existe plus)
- **Tabs** : `NativeTabs` depuis `expo-router/native-tabs` (Label/Icon/VectorIcon en sous-composants de `Trigger`)
- **Animations** : @legendapp/motion (utilisé — transitions de phase, pulsation 10s, banner). `Motion.View` sans `className` : mettre les styles sur un `View` enfant
- **Anneau** : react-native-svg (`components/timer/ProgressRing.tsx`)
- **Haptiques** : expo-haptics (utilisé — alerte 10s + fin de phase)
- **Audio** : expo-audio (`useAudioPlayer` — `assets/sounds/boxing_bell.wav`)
- **Keep-awake** : expo-keep-awake (utilisé — actif sur l'écran Timer)
- **Timer** : machine à états pure basée sur des timestamps (`components/timer/machine.ts`), testée avec `npm test` (node:test via tsx)
- **Persistance** : @react-native-async-storage/async-storage (clé `boxing-timer-config`)

## Structure du projet

```
app/
  _layout.tsx          # Root layout — GluestackUIProvider (mode "system")
  (tabs)/
    _layout.tsx        # Tab navigation (NativeTabs)
    index.tsx          # Écran Timer (tab principale)
    community.tsx      # Tab Community — en développement (partage de workouts)
assets/
  sounds/
    boxing_bell.wav    # Son de cloche fourni par l'utilisateur
components/
  timer/
    index.tsx          # Écran Timer (affichage uniquement)
    config.ts          # Type Config, DEFAULTS, LIMITS, PRESETS, parseConfig, formatage
    machine.ts         # Machine à états pure (start/pause/resume/tick) + machine.test.ts
    ProgressRing.tsx   # Anneau de progression SVG
    EditModal.tsx      # Modal d'édition d'une valeur
    ConfigRow.tsx      # Ligne de réglage avec bouton crayon
  ui/
    button/            # Button Gluestack (ne pas modifier)
    gluestack-ui-provider/
hooks/
  useBoxingTimer.ts    # Branche la machine sur React (tick 250 ms, cloche, haptiques)
  useBell.ts           # Cloche (expo-audio)
  useStoredConfig.ts   # Config persistée (AsyncStorage)
```

## Conventions de code

- **Styles** : NativeWind via `className`. Ne jamais utiliser `StyleSheet.create`.
- **Composants UI** : Gluestack UI pour les primitives (Button, etc.). Ne pas réinventer.
- **Icônes** : `@expo/vector-icons` — MaterialCommunityIcons en priorité (cohérence avec la nav).
- **Imports** : alias `@/` pour la racine du projet (configuré dans tsconfig + babel).
- **Pas de commentaires** sauf si le WHY est non-évident.
- **Pas de mock de fonctionnalités** : préférer des vraies implémentations.

## Comportement spécifique boxing timer

- Défauts : **3 rounds**, **180s** par round, **60s** de repos.
- Plages autorisées : rounds 1–100, durée 1–300s, repos 1–300s.
- L'ordre des phases : `idle → round → rest → round → … → done`
- Les alertes haptiques se déclenchent **10 secondes avant** la fin de chaque phase.
- Le son de cloche se joue au **démarrage** et à chaque **changement de phase**.
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
