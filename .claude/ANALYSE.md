# Analyse technique — Boxing Timer

_Date : 2026-05-14_

## Vue d'ensemble

Application mobile de minuterie pour la boxe, construite avec Expo / React Native. Le projet est en début de développement : seule la structure de base et un timer rudimentaire sont en place.

## Architecture actuelle

### Routing

Expo Router v6 avec tabs natives (`NativeTabs` de `expo-router/unstable-native-tabs`). Trois onglets : Timer (principal), Community (stub), About (stub).

### Composant Timer (`components/timer/index.tsx`)

- Utilise `react-timer-hook` pour le décompte
- Timer hardcodé à **10 secondes** (valeur de test, non configurable)
- Interval à 100ms pour afficher les millisecondes
- États : Running / Paused / Expired
- `alert()` utilisé pour la notification d'expiration — à remplacer

**Problèmes identifiés** :
1. La durée est hardcodée à 10s dans deux endroits : `app/(tabs)/index.tsx` et `components/timer/index.tsx` (`resetTimer`)
2. `alert()` bloque le thread UI et est une mauvaise UX
3. Pas de configuration de rounds ni de repos
4. Le bouton "Start" appelle `resume()` — ne fonctionne pas si le timer n'est jamais pausé (devrait appeler `start()`)
5. `isTimerExpired` dans `useEffect` → `alert()` crée un effet de bord lors du premier rendu si le timestamp est passé

### Theming

- `GluestackUIProvider` configuré en mode `"dark"` dans `app/_layout.tsx`
- Mais le Timer a `bg-white` — incohérence avec le dark mode

### Dépendances notables non encore utilisées

| Package | Usage prévu |
|---|---|
| `expo-haptics` | Alertes haptiques (fin de round) |
| `@legendapp/motion` | Animations (progression, transitions) |
| `react-native-svg` | Cercle de progression (timer circulaire) |
| `react-aria` + `react-stately` | Accessibilité, sliders de configuration |
| `tailwind-variants` | Variantes de style conditionnelles |

### Dépendances potentiellement superflues

- `@expo/html-elements` — pas d'utilisation visible, sans doute vestige du template
- `expo-image` — pas utilisé actuellement

## Qualité du code

- **TypeScript** : configuré mais peu exploité (seul `expiryTimestamp: Date` est typé explicitement)
- **Pas de tests** : aucun fichier de test présent
- **ESLint** : configuré (`eslint-config-expo`)
- **React Compiler** activé — attention aux patterns incompatibles (mutations directes d'objets, `useMemo` inutile)

## Risques et points d'attention

| Risque | Sévérité | Note |
|---|---|---|
| `NativeTabs` est `unstable` | Moyen | API peut changer entre versions Expo |
| Gluestack UI v3 + NativeWind v4 | Faible | Stack récente, docs parfois incomplètes |
| React 19.1 + React Compiler | Faible | Experimental, surveiller les regressions |
| Pas de gestion de l'état global | Faible | OK pour l'instant, à surveiller si la config timer grandit |

## Points forts

- Stack moderne et cohérente (Expo Router, NativeWind, Gluestack)
- New Architecture activée dès le départ
- Toutes les dépendances nécessaires à un timer boxing complet sont déjà installées
- TypeScript configuré
