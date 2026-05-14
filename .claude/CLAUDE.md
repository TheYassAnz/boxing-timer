# Boxing Timer — Guide Claude Code

## Stack

- **Framework** : Expo SDK 54 + Expo Router v6 (file-based routing)
- **UI** : NativeWind v4 (Tailwind CSS) + Gluestack UI v3
- **Langage** : TypeScript strict
- **React** : 19.1.0 avec React Compiler activé (experimental)
- **New Architecture** activée (`newArchEnabled: true`)
- **Animations** : @legendapp/motion + react-native-reanimated
- **Haptiques** : expo-haptics (déjà installé, pas encore utilisé)
- **Timer** : react-timer-hook

## Structure du projet

```
app/
  _layout.tsx          # Root layout — GluestackUIProvider (mode dark)
  (tabs)/
    _layout.tsx        # Tab navigation (NativeTabs)
    index.tsx          # Écran Timer (tab principale)
    community.tsx      # Placeholder — ne pas développer pour l'instant
    about.tsx          # Placeholder
components/
  timer/
    index.tsx          # Composant Timer principal
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

- La durée d'un round standard en boxe est **3 minutes**, repos **1 minute**.
- L'ordre des phases : [Warmup optionnel] → Round → Repos → Round → … → Fin
- Les alertes sonores/haptiques se déclenchent **10 secondes avant** la fin de chaque phase.
- Utiliser `expo-haptics` pour les vibrations (déjà installé).

## Ce qu'il NE faut PAS faire

- Ne pas développer la tab Community (placeholder, future feature).
- Ne pas utiliser `alert()` — remplacer par des feedbacks visuels/haptiques.
- Ne pas hardcoder la durée du timer (actuellement 10s dans `index.tsx` et `timer/index.tsx`).
- Ne pas ajouter de gestion d'état globale (Redux, Zustand) pour l'instant — `useState` suffit.
- Ne pas publier sur l'App Store — usage personnel uniquement.

## Commandes utiles

```bash
npm start          # Démarre Expo (scan QR code)
npm run ios        # Simulateur iOS
npm run android    # Émulateur Android
npm run lint       # ESLint
```

## Plateforme cible

iOS et Android en parité. Pas de Web comme priorité. Tester sur les deux avant de marquer une feature comme terminée.
