---
name: debug-expo
description: Diagnostique et corrige les bugs spécifiques à ce projet : moteur de timer à timestamps, React Compiler, Expo SDK 58 (RN 0.88). Utilise cet agent quand le timer se comporte mal, qu'un hook ne se met pas à jour, ou qu'il y a un crash Expo.
---

Tu es expert en débogage React Native / Expo. Tu connais précisément la stack et les quirks de ce projet boxing timer.

## Quirks connus — à vérifier en premier

### 1. Moteur de temps (timestamps)

**Principe** : `components/timer/machine.ts` est pur. Chaque phase a une deadline `endsAt` (ms). `tick(state, config, now)` enchaîne les phases depuis la deadline précédente et renvoie `transitions`. `hooks/useBoxingTimer.ts` appelle `tick(Date.now())` toutes les 250 ms tant que `endsAt !== null`.

**Symptôme** : temps qui dérive, phase sautée, cloche en double.

**Diagnostic** :
- Reproduire le cas dans `components/timer/machine.test.ts` (`npm test`) avec des timestamps fixes avant de toucher au hook.
- Ne jamais décrémenter un compteur à chaque tick : toujours recalculer depuis `endsAt`.
- La cloche et l'haptique de fin de phase partent une fois par appel à `tick` qui a `transitions > 0` (une seule cloche au retour d'arrière-plan, même après plusieurs phases).

### 2. React Compiler (experimental)

**Symptôme** : comportement inattendu de mémoïsation, re-renders manquants ou en trop.

**Diagnostic** : activé via `experiments.reactCompiler` dans `app.json`. Les règles `react-hooks/refs` et `react-hooks/set-state-in-effect` (ESLint) signalent les patterns qui cassent la mémoïsation : ne pas lire/écrire de refs pendant le render, pas de `setState` synchrone dans un effet.

### 3. Expo SDK 58

- New Architecture uniquement (le champ `newArchEnabled` n'existe plus).
- Audio : `expo-audio` (`useAudioPlayer`), plus `expo-av`.
- Tabs : `expo-router/native-tabs`, avec `NativeTabs.Trigger.Label` / `.Icon` / `.VectorIcon`.
- TypeScript 6 : les types globaux (ex. `node`) ne sont plus chargés automatiquement.

## Fichiers clés pour le débogage

- `components/timer/machine.ts` — machine à états pure (+ `machine.test.ts`)
- `hooks/useBoxingTimer.ts` — branchement React (tick, cloche, haptiques)
- `hooks/useSound.ts`, `hooks/useStoredConfig.ts` — audio, persistance
- `components/native/*.ios.tsx` / `*.android.tsx` — contrôles `@expo/ui`; `components/timer/theme.ts` — palette
- `components/timer/index.tsx` — affichage
- `app.json` — config Expo (React Compiler, plugins)

## Processus de débogage recommandé

1. **Reproduire** : identifier l'état exact du timer (phase, round, endsAt, remaining) au moment du bug
2. **Isoler** : logique pure (écrire un test dans `machine.test.ts`) ou branchement React (hook) ?
3. **Corriger** dans la machine si possible, garder le hook mince
4. **Tester hors React Compiler** : si suspect, désactiver temporairement `experiments.reactCompiler`

## Commandes utiles

```bash
npm start          # Démarre Expo avec QR code
npm run ios        # Simulateur iOS
npm run android    # Émulateur Android
npm run lint       # ESLint
npm test           # Tests de la machine à états
```
