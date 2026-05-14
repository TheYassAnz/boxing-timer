# Analyse technique — Boxing Timer

_Dernière mise à jour : 2026-05-14_

## Vue d'ensemble

Application mobile de minuterie pour la boxe, construite avec Expo SDK 54 / React Native. Le cœur fonctionnel est terminé : le timer enchaîne les rounds et les repos, avec son, haptiques, configuration persistée et écran anti-veille.

---

## Architecture actuelle

### Routing

Expo Router v6 avec `NativeTabs` (`expo-router/unstable-native-tabs`). Trois onglets :
- **Timer** (`app/(tabs)/index.tsx`) — écran principal, renvoie `<Timer />`
- **Community** (`app/(tabs)/community.tsx`) — stub vide, ne pas développer
- **About** (`app/(tabs)/about.tsx`) — stub vide

Le root layout (`app/_layout.tsx`) enveloppe tout dans `GluestackUIProvider mode="system"` (dark/light selon le système) et importe `global.css` pour NativeWind.

### Composant Timer (`components/timer/index.tsx`)

Seul composant métier. Contient :

**Machine à états** : `idle → round → rest → round → … → done`

| État | Description |
|---|---|
| `idle` | Affichage des réglages, timer figé sur la durée configurée |
| `round` | Chrono actif, fond clair |
| `rest` | Chrono actif, fond navy |
| `done` | Terminé, banner "Terminé !" affiché |

**Sous-composants internes** :
- `EditModal` — modal centré (fade), un champ `TextInput` numérique par valeur, `autoFocus`, validation des bornes à la fermeture
- `ConfigRow` — ligne avec label, valeur formatée et bouton crayon `pencil-outline`

**Refs pour closures stables dans `onExpire`** :
```
phaseRef, roundRef, configRef, bellRef
```
Le hook `useTimer` capture `onExpire` à l'initialisation — sans les refs, phase/config seraient stale.

**Workaround react-timer-hook** : `restart()` appelé dans `onExpire` est écrasé par le `isRunning = false` interne du hook. Fix : `setTimeout(() => restart(...), 0)` pour différer après le cycle courant.

**Son** : `expo-av` charge `assets/sounds/boxing_bell.mp3` au mount. `playBell()` déclenche `replayAsync()` avec fallback silencieux. Joué au démarrage et à chaque changement de phase.

**Haptiques** : `expo-haptics`
- `ImpactFeedbackStyle.Heavy` à 10 secondes restantes
- `NotificationFeedbackType.Success` à chaque fin de phase

**Persistance** : `AsyncStorage` (clé `boxing-timer-config`), lecture au mount, écriture à chaque changement de `config`.

**Keep-awake** : `useKeepAwake()` actif en permanence sur cet écran.

### Fichier mort

`components/timer/ConfigSheet.tsx` — bottom sheet avec 3 champs, plus utilisé. À supprimer.

---

## Dépendances — état d'utilisation

| Package | Utilisé | Notes |
|---|---|---|
| `react-timer-hook` | ✅ | Timer principal |
| `expo-haptics` | ✅ | Alerte 10s + fin de phase |
| `expo-av` | ✅ | Son de cloche |
| `expo-keep-awake` | ✅ | Anti-veille |
| `@react-native-async-storage/async-storage` | ✅ | Persistance config |
| `@expo/vector-icons` | ✅ | Icônes (MaterialCommunityIcons) |
| `nativewind` | ✅ | Tous les styles via `className` |
| `@gluestack-ui/core` | ✅ | Button, GluestackUIProvider |
| `@legendapp/motion` | ❌ | Animations — pas encore utilisé |
| `react-native-svg` | ❌ | Timer circulaire — pas encore utilisé |
| `react-native-reanimated` | ❌ | Animations avancées — pas encore utilisé |
| `react-aria` / `react-stately` | ❌ | Accessibilité — non utilisé |
| `@expo/html-elements` | ❌ | Vestige du template, probablement inutile |
| `expo-image` | ❌ | Non utilisé |
| `tailwind-variants` | ❌ | Non utilisé |

---

## Risques et points d'attention

| Risque | Sévérité | Note |
|---|---|---|
| `NativeTabs` est `unstable` | Moyen | API peut changer entre versions Expo |
| `onExpire` stale closure | Résolu | Via refs + setTimeout workaround documenté |
| React Compiler (experimental) | Faible | Surveiller les regressions sur les hooks |
| Gluestack UI v3 + NativeWind v4 | Faible | Stack récente, interactions parfois surprenantes |
| `ConfigSheet.tsx` dead code | Faible | À supprimer pour éviter la confusion |

---

## Points forts

- Machine à états claire et robuste, sans état global
- Refs bien utilisées pour éviter les stale closures dans les callbacks du hook timer
- Fallbacks silencieux sur audio et storage (app fonctionnelle même si l'un d'eux échoue)
- Stack moderne : New Architecture, React Compiler, Expo Router v6
