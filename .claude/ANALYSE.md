# Analyse technique — Boxing Timer

_Dernière mise à jour : 2026-05-14_

## Vue d'ensemble

Application mobile de minuterie pour la boxe, construite avec Expo SDK 58 / React Native. Le cœur fonctionnel est terminé : le timer enchaîne les rounds et les repos, avec son, haptiques, configuration persistée et écran anti-veille.

---

## Architecture actuelle

### Routing

Expo Router 58 avec `NativeTabs` (`expo-router/native-tabs`). Deux onglets :
- **Timer** (`app/(tabs)/index.tsx`) — écran principal, renvoie `<Timer />`
- **Community** (`app/(tabs)/community.tsx`) — stub vide, ne pas développer

Le root layout (`app/_layout.tsx`) enveloppe tout dans `GluestackUIProvider mode="system"` (dark/light selon le système) et importe `global.css` pour NativeWind.

### Composant Timer (`components/timer/index.tsx` + `hooks/`)

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

**Moteur de temps** (`components/timer/machine.ts`, pur et testé) : chaque phase a une deadline `endsAt` (timestamp ms). `tick(state, config, now)` enchaîne les phases depuis la deadline précédente et renvoie le nombre de transitions, ce qui rattrape exactement le temps passé en arrière-plan. `useBoxingTimer` appelle `tick(Date.now())` toutes les 250 ms tant que le timer tourne, joue la cloche à chaque transition et déclenche l'haptique en passant sous 10 s.

**Son** : `expo-audio` (`useAudioPlayer`) charge `assets/sounds/boxing_bell.wav`. `playBell()` fait `seekTo(0)` puis `play()` avec fallback silencieux. Joué au démarrage et à chaque changement de phase.

**Haptiques** : `expo-haptics`
- `ImpactFeedbackStyle.Heavy` à 10 secondes restantes
- `NotificationFeedbackType.Success` à chaque fin de phase

**Persistance** : `AsyncStorage` (clé `boxing-timer-config`), lecture au mount, écriture à chaque changement de `config`.

**Keep-awake** : `useKeepAwake()` actif en permanence sur cet écran.

---

## Dépendances — état d'utilisation

| Package | Utilisé | Notes |
|---|---|---|
| `tsx` (dev) | ✅ | Lance `npm test` (node:test) |
| `expo-haptics` | ✅ | Alerte 10s + fin de phase |
| `expo-audio` | ✅ | Son de cloche (remplace expo-av, retiré en SDK 55) |
| `expo-keep-awake` | ✅ | Anti-veille |
| `@react-native-async-storage/async-storage` | ✅ | Persistance config |
| `@expo/vector-icons` | ✅ | Icônes (MaterialCommunityIcons) |
| `nativewind` | ✅ | Tous les styles via `className` |
| `@gluestack-ui/core` | ✅ | Button, GluestackUIProvider |
| `@legendapp/motion` | ❌ | Animations — pas encore utilisé |
| `react-native-svg` | ❌ | Timer circulaire — pas encore utilisé |
| `react-native-reanimated` | ❌ | Animations avancées — pas encore utilisé |
| `react-aria` / `react-stately` / `tailwind-variants` | ⚙️ | Peer deps de @gluestack-ui/utils — ne pas supprimer |

---

## Risques et points d'attention

| Risque | Sévérité | Note |
|---|---|---|
| Timer en arrière-plan | Résolu | Rattrapage par timestamps (la cloche sonne au retour, pas pendant) |
| React Compiler (experimental) | Faible | Surveiller les regressions sur les hooks |
| Gluestack UI v3 + NativeWind v4 | Faible | Stack récente, interactions parfois surprenantes |

---

## Points forts

- Machine à états claire et robuste, sans état global
- Refs bien utilisées pour éviter les stale closures dans les callbacks du hook timer
- Fallbacks silencieux sur audio et storage (app fonctionnelle même si l'un d'eux échoue)
- Stack moderne : New Architecture, React Compiler, Expo SDK 58
