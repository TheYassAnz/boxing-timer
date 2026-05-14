---
name: charte-audit
description: Vérifie que les composants respectent la charte graphique boxing (palette, typographie, formes, dark mode). Lance ce skill après avoir ajouté ou modifié un composant UI.
---

Tu vas auditer la conformité des composants à la charte graphique boxing timer. Examine les fichiers `.tsx` dans `components/` et `app/`.

## Points de contrôle

### 1. Couleurs — tokens NativeWind obligatoires

Chercher les couleurs hex inline qui devraient être des tokens :
```bash
grep -rn "#274c77\|#6096ba\|#a3cef1\|#e7ecef\|#ef233c\|#0d1b2a" --include="*.tsx" .
```

Palette autorisée :
- `boxing-navy` (#274c77)
- `boxing-blue` (#6096ba)
- `boxing-sky` (#a3cef1)
- `boxing-white` (#e7ecef)
- `boxing-dark` (#0d1b2a)
- `boxing-alert` (#ef233c)

### 2. StyleSheet.create interdit

```bash
grep -rn "StyleSheet.create" --include="*.tsx" --include="*.ts" .
```
Résultat attendu : 0 occurrences.

### 3. Dark mode — chaque couleur doit avoir son variant dark

Pour chaque `bg-boxing-*` ou `text-boxing-*` sans préfixe `dark:`, vérifier si le variant dark est manquant ou intentionnel.

Pattern attendu :
```
bg-boxing-white dark:bg-boxing-dark
text-boxing-navy dark:text-boxing-white
text-boxing-blue dark:text-boxing-sky
```

### 4. Typographie

Vérifier que le timer display utilise : `text-8xl font-black font-mono tracking-widest`

Vérifier que les labels de boutons utilisent : `uppercase tracking-widest font-bold`

### 5. Formes

- Boutons principaux : `rounded-full` (pas `rounded-lg` ou autre)
- Modals / cards : `rounded-2xl` ou `rounded-3xl`
- Inputs : `rounded-xl`

### 6. Icônes

```bash
grep -rn "from '@expo/vector-icons'" --include="*.tsx" .
```
Vérifier que seul `MaterialCommunityIcons` est utilisé (pas Ionicons, FontAwesome, etc.).

## Format du rapport

Pour chaque problème trouvé :
```
[FICHIER:LIGNE] Problème — Correction suggérée
```

Si tout est conforme : "Audit OK — aucune non-conformité détectée."
