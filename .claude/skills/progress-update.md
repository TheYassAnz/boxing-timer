---
name: progress-update
description: Met à jour PROGRESS.md et ANALYSE.md après avoir terminé une feature ou un refactoring. Lance ce skill en fin de session de développement.
---

Tu vas mettre à jour les fichiers de suivi du projet boxing timer.

## Étape 1 — Analyser ce qui a changé

```bash
git diff main --name-only
git log main..HEAD --oneline
```

Lire les fichiers modifiés pour comprendre ce qui a été implémenté.

## Étape 2 — Mettre à jour PROGRESS.md

Fichier : `.claude/PROGRESS.md`

Pour chaque tâche complétée :
- Passer le statut de `❌ À faire` à `✅ Fait`
- Ajouter une note concise dans la colonne Notes si pertinent

Pour les nouvelles tâches découvertes (bugs, sous-tâches) :
- Les ajouter dans la bonne phase ou dans **Backlog / Idées futures**

Mettre à jour la date en haut du fichier (`_Dernière mise à jour : YYYY-MM-DD_`).

Mettre à jour le statut global si une phase entière est terminée :
- `🟡 En cours (phase X — Nom)` → `✅ Terminée` si tous les items sont cochés

## Étape 3 — Mettre à jour ANALYSE.md si nécessaire

Fichier : `.claude/ANALYSE.md`

Mettre à jour uniquement si :
- Un nouveau composant a été créé (documenter son rôle)
- Un fichier mort a été supprimé (retirer la mention)
- Un quirk a été résolu définitivement (mettre à jour le tableau Risques)
- Une dépendance a été mise en usage (changer ❌ → ✅ dans le tableau)

Ne pas réécrire l'analyse complète — modifier seulement ce qui a changé.

Mettre à jour la date en haut du fichier.

## Étape 4 — Vérification

Relire les deux fichiers et vérifier la cohérence :
- Les tâches marquées ✅ dans PROGRESS.md correspondent bien à du code existant
- Le statut global reflète l'état réel du projet
- Aucune tâche "À faire" n'est en réalité déjà implémentée

## Format des dates

Toujours au format `YYYY-MM-DD`.
