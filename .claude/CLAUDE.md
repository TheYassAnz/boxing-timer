# Boxing Timer — Guide Claude Code

## Stack

- **Framework** : Expo SDK 54 + Expo Router v6 (file-based routing)
- **UI** : NativeWind v4 (Tailwind CSS) + Gluestack UI v3
- **Langage** : TypeScript strict
- **React** : 19.1.0 avec React Compiler activé (experimental)
- **New Architecture** activée (`newArchEnabled: true`)
- **Animations** : @legendapp/motion + react-native-reanimated (installés, pas encore utilisés)
- **Haptiques** : expo-haptics (utilisé — alerte 10s + fin de phase)
- **Audio** : expo-av (utilisé — `assets/sounds/boxing_bell.mp3`)
- **Keep-awake** : expo-keep-awake (utilisé — actif sur l'écran Timer)
- **Timer** : react-timer-hook
- **Persistance** : @react-native-async-storage/async-storage (clé `boxing-timer-config`)

## Structure du projet

```
app/
  _layout.tsx          # Root layout — GluestackUIProvider (mode "system")
  (tabs)/
    _layout.tsx        # Tab navigation (NativeTabs)
    index.tsx          # Écran Timer (tab principale)
    community.tsx      # Tab Community — en développement (partage de workouts)
    about.tsx          # À supprimer
assets/
  sounds/
    boxing_bell.mp3    # Son de cloche fourni par l'utilisateur
components/
  timer/
    index.tsx          # Composant Timer principal (machine à états + UI complète)
    ConfigSheet.tsx    # Dead code — plus utilisé, à supprimer
  ui/
    button/            # Button Gluestack (ne pas modifier)
    gluestack-ui-provider/
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

- **react-timer-hook** : appeler `restart()` directement dans `onExpire` est écrasé par le `isRunning = false` interne. Toujours différer avec `setTimeout(() => restart(...), 0)`.
- **onExpire stale closure** : `useTimer` capture `onExpire` à l'initialisation. Utiliser des refs (`phaseRef`, `roundRef`, `configRef`) pour accéder aux valeurs courantes.

## Ce qu'il NE faut PAS faire

- Ne pas développer la tab About — à supprimer.
- La tab Community est en cours de développement (voir PROGRESS.md).
- Ne pas utiliser `alert()` — feedbacks visuels/haptiques uniquement.
- Ne pas ajouter de gestion d'état globale (Redux, Zustand) — `useState` suffit.
- Ne pas appeler `restart()` directement dans `onExpire` sans `setTimeout`.
- Ne pas publier sur l'App Store — usage personnel uniquement.

## Commandes utiles

```bash
npm start          # Démarre Expo (scan QR code)
npm run ios        # Simulateur iOS
npm run android    # Émulateur Android
npm run lint       # ESLint
```

## Plateforme cible

iOS et Android en parité. Pas de Web comme priorité.
