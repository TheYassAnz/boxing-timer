---
name: cleanup
description: Supprime le dead code du projet (fichiers inutilisés, imports orphelins, composants abandonnés). Lance ce skill avant un commit ou quand le projet accumule des restes.
---

Tu vas nettoyer le dead code de ce projet boxing timer. Procède dans cet ordre :

## 1. Identifier les fichiers morts connus

Vérifie si ces fichiers existent encore et si quelque chose les importe :

- `components/timer/ConfigSheet.tsx` — bottom sheet abandonnée, remplacée par le modal inline
- `app/(tabs)/about.tsx` — tab placeholder, à supprimer si la décision a été prise

Pour chaque fichier, grep les imports avant de supprimer :
```bash
grep -r "ConfigSheet" --include="*.tsx" --include="*.ts" .
grep -r "about" app/ --include="*.tsx"
```

## 2. Vérifier les dépendances inutilisées dans package.json

Lister les packages marqués ❌ dans ANALYSE.md :
- `@legendapp/motion` — maintenant peut-être utilisé, vérifier
- `react-native-svg` — vérifier usage
- `@expo/html-elements` — probablement vestige du template
- `expo-image`, `tailwind-variants` — vérifier usage

Pour chaque package suspect :
```bash
grep -r "from '@expo/html-elements'" --include="*.tsx" --include="*.ts" .
```

## 3. Vérifier les imports orphelins dans les fichiers existants

Chercher les imports inutilisés signalés par ESLint :
```bash
npm run lint 2>&1 | grep "no-unused"
```

## 4. Vérifier la navigation si des tabs sont supprimées

Si `about.tsx` est supprimé, vérifier que `app/(tabs)/_layout.tsx` ne référence plus cette route.

## 5. Rapport final

Après nettoyage, lister :
- Ce qui a été supprimé
- Ce qui a été conservé (et pourquoi)
- Les warnings ESLint résiduels s'il en reste

Ne supprimer un fichier que si tu as vérifié qu'aucun import ne le référence.
