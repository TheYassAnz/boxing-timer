# Refonte design native — Boxing Timer

Date : 2026-11-05 · Statut : en attente de validation

## Intention

L'app est utilisée en salle : le téléphone est posé près d'une enceinte connectée, l'utilisateur le regarde de loin et le touche à mains nues (gants retirés), vite, entre deux rounds. Aujourd'hui les boutons sont trop petits et l'app a un style maison (Gluestack + charte bleu marine) identique sur iOS et Android.

Objectif : une app qui a l'air native sur chaque plateforme, lisible de loin, avec de grosses cibles tactiles, et des préréglages qui collent à son entraînement réel. Exigence de finition : « nickel » — rien d'approximatif.

## Objectifs

1. Composants natifs réels : SwiftUI sur iOS, Jetpack Compose / Material 3 sur Android, via `@expo/ui` (Expo SDK 58).
2. Direction visuelle **B** (choisie par l'utilisateur) : fonds, textes et surfaces aux couleurs système (clair/sombre selon le téléphone), **une seule couleur d'accent : rouge** (`systemRed` iOS / rouge Material sur Android).
3. Gros boutons : boutons ronds ~80 pt pendant la séance (style app Horloge iOS), bouton Démarrer ~96 pt.
4. Nouveaux préréglages et rounds illimités.
5. Son « clac clac clac » (claquoir) sur les 10 dernières secondes d'un round.

## Non-objectifs

- **La cloche quand l'écran est verrouillé** : problème de fonctionnement, traité dans un projet séparé après cette refonte. (Constat : le timer rattrape bien le temps au retour grâce aux timestamps, mais aucune cloche ne sonne pendant le verrouillage.)
- La tab Community : pas de nouvelle fonctionnalité ; elle adopte seulement le nouveau style (couleurs système, accent rouge).
- Pas de Web.

## Anti-objectifs (échec même si ça marche)

- Une app qui ressemble encore à un « thème maison » posé sur des composants natifs.
- Des incohérences entre écrans, des alignements approximatifs, des détails non finis.
- Des boutons qu'on peut rater d'un geste rapide.

## Écran Timer — avant la séance (phase `idle`)

Maquette de référence : `.superpowers/brainstorm/31763-1793876320/content/ecran-reglages-v2.html`.

- Titre « Timer ».
- **Sélecteur segmenté natif** à 3 préréglages (iOS : `Picker` style segmenté ; Android : segmented buttons Material 3) :
  | Préréglage | Rounds | Round | Repos |
  |---|---|---|---|
  | Échauffement | Illimité | 30 s | 30 s |
  | Assauts | Illimité | 1:30 | 0:35 |
  | Sparring | 12 | 3:00 | 1:00 |

  Remplacent Amateur / Pro / Sparring.
- **Les préréglages sont des raccourcis** (décision utilisateur) : toucher un segment remplit les réglages, rien d'autre. Modifier ensuite un réglage ne modifie jamais le préréglage. La config en cours reste persistée comme aujourd'hui (AsyncStorage).
- Un segment n'est surligné que si la config correspond exactement à ce préréglage ; sinon aucun segment n'est sélectionné. *(appel de Claude)*
- **Liste de réglages native** (iOS : style `Form`/app Réglages ; Android : liste Material) :
  - Rounds : stepper − / +, valeur affichée ; en dessous de 1 → « Illimité ». Plage 1–100 + Illimité. *(appel de Claude)*
  - Durée du round, Repos — plage 1–300 s :
    - **iOS : roue native** minutes/secondes, ouverte inline en touchant la ligne (décision utilisateur ; ex. deux `Picker` SwiftUI style roue).
    - **Android : boutons − / + Material** (même composant que les rounds), pas de 5 s, valeur affichée en m:ss. Material 3 n'a pas de roue minutes/secondes native ; un composant dessiné sur mesure casserait l'objectif « natif ». *(appel de Claude, l'utilisateur a délégué le choix Android)*
- Remplacent `ConfigRow` (crayon) et `EditModal` (saisie clavier), qui disparaissent.
- Gros bouton rond **Démarrer** (~96 pt), accent rouge, en bas.

## Écran Timer — pendant la séance

Maquette de référence : option B de `.superpowers/brainstorm/31763-1793876320/content/direction-couleurs.html`.

- Libellé : « Round 2 / 12 », ou « Round 7 » en mode illimité ; « Repos » pendant le repos.
- Anneau de progression conservé (`ProgressRing`), couleur d'accent.
- Chiffres plus grands, graisse fine, chiffres à chasse fixe (`tabular-nums`) pour qu'ils ne bougent pas.
- Deux boutons ronds ~80 pt côte à côte : **Réinitialiser** (gauche, gris système) et **Pause / Reprendre** (droite, accent). Appui simple sur Réinitialiser, sans confirmation (décision utilisateur).
- **Repos en vert** (`systemGreen` / vert Material) : l'accent passe du rouge au vert pendant le repos pour identifier la phase d'un coup d'œil. *(appel de Claude, non contesté)*
- 10 dernières secondes : vibration et pulsation conservées.
- Fin de séance (`done`, uniquement en mode à rounds fixes) : « Terminé » affiché, bouton principal → Réinitialiser. Le style exact est laissé au builder, dans la direction B. *(appel de Claude)*

## Rounds illimités

- Le timer enchaîne round → repos → round… sans jamais passer en `done` ; seul l'utilisateur l'arrête (Réinitialiser).
- Représentation dans `Config` / `machine.ts` laissée au builder (ex. `rounds: null` ou `0`), avec tests `node:test` à jour. `parseConfig` doit accepter la nouvelle valeur et rester tolérant aux anciennes configs stockées.

## Son claquoir (« clac clac clac »)

- Joué pendant les **10 dernières secondes de chaque round** (pas du repos), en plus de la vibration. Rythme et durée exacts laissés au builder, l'idée est le claquoir de salle de boxe.
- Fichier à trouver **libre de droits (CC0 de préférence)** ; le faire écouter à l'utilisateur avant intégration ; noter la source et la licence dans le repo.
- Joué via `expo-audio` comme la cloche (`hooks/useBell.ts` comme modèle).

## Contraintes

- Expo SDK 58, RN 0.88, React 19.3 + React Compiler, TypeScript strict.
- iOS et Android en parité.
- Machine à états à timestamps intacte (cf. `.claude/CLAUDE.md`, « Quirks connus »).
- **Lancement : Expo Go sur l'iPhone de l'utilisateur, gratuit, sans compte Apple payant ni dev build** (décision utilisateur). `@expo/ui` est embarqué dans Expo Go, donc compatible ; il n'est pas encore installé dans le projet (`npx expo install @expo/ui`). Toute dépendance ajoutée doit être incluse dans Expo Go — aucune lib à code natif tiers. Les composants `@expo/ui` sont rendus dans un `Host`.
- NativeWind reste pour la mise en page des vues React Native (conteneurs, espacements, textes hors `@expo/ui`). Les couleurs système passent par les modifiers `@expo/ui` ou `PlatformColor` (prop `style` inline, jamais `StyleSheet.create`). Gluestack est retiré. *(appel de Claude)*
- Cette refonte change les conventions du projet : Gluestack et la charte `CHARTE.md` sont remplacés par les composants natifs et les couleurs système. Mettre à jour `.claude/CLAUDE.md` et `CHARTE.md` en conséquence ; retirer ce qui devient inutilisé.

## Laissé au builder

- Choix exact des composants `@expo/ui` et de leurs modifiers par plateforme.
- Mise en page fine, espacements, animations de transition (dans l'esprit natif).
- Représentation de « illimité » dans le code.
- Vérification visuelle sur simulateur iOS et émulateur Android, clair et sombre.
