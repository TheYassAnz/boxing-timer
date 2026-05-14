# Progression — Boxing Timer

_Dernière mise à jour : 2026-05-14_

## Statut global : 🟡 En cours (phase 3 — UX / Design / Config)

---

## Phase 1 — Timer de base fonctionnel ✅ Terminée

| Tâche                                   | Statut  | Notes                                |
| --------------------------------------- | ------- | ------------------------------------ |
| Structure du projet (Expo Router, tabs) | ✅ Fait |                                      |
| Composant Timer avec start/pause/reset  | ✅ Fait |                                      |
| Intégration NativeWind + Gluestack      | ✅ Fait |                                      |
| Dark mode configuré                     | ✅ Fait |                                      |
| Timer hardcodé → durée configurable     | ✅ Fait | Prop `durationSeconds`, défaut 3 min |
| Remplacer `alert()` par feedback visuel | ✅ Fait | Banner "Terminé !" + expo-haptics    |
| Corriger bouton Start (resume → start)  | ✅ Fait | Toggle unifié Start/Pause/Reprendre  |
| Cohérence dark mode dans Timer          | ✅ Fait | bg-background-950, text-typography-0 |

---

## Phase 2 — Fonctionnalités boxing ✅ Terminée

| Tâche                                          | Statut     | Notes                                         |
| ---------------------------------------------- | ---------- | --------------------------------------------- |
| Configuration : nombre de rounds               | ✅ Fait    | Défaut 3, min 1, max 100                      |
| Configuration : durée d'un round               | ✅ Fait    | Défaut 3 min (180s), min 1s, max 5 min (300s) |
| Configuration : durée du repos                 | ✅ Fait    | Défaut 1 min (60s), min 1s, max 5 min (300s)  |
| Enchaînement automatique Round → Repos → Round | ✅ Fait    | Machine à états idle/round/rest/done          |
| Affichage du round actuel (ex: Round 2/5)      | ✅ Fait    | + label "Repos · Round X →" pendant le repos  |
| Alerte 10 secondes avant fin de phase          | ✅ Fait    | Haptic ImpactFeedbackStyle.Heavy à 10s        |
| Vibrations avec expo-haptics                   | ✅ Fait    | Notification à chaque fin de phase            |
| Son de cloche / buzzer                         | ⏭️ Reporté | Phase 3 — besoin d'expo-av                    |

---

## Phase 3 — UX / Design / Config

| Tâche                                       | Statut     | Notes                                                                   |
| ------------------------------------------- | ---------- | ----------------------------------------------------------------------- |
| Configuration via modal par valeur          | ✅ Fait    | Bouton ✎ par ligne, modal centré, clavier numérique, autoFocus          |
| Persistance de la configuration             | ✅ Fait    | AsyncStorage (`boxing-timer-config`)                                    |
| Correction pause au changement de phase     | ✅ Fait    | setTimeout pour différer restart après cleanup interne react-timer-hook |
| Empêcher la mise en veille                  | ✅ Fait    | `useKeepAwake()` — actif dès que l'écran Timer est monté                |
| Son de cloche                               | ✅ Fait    | expo-av · bell.wav généré · joué au début de chaque round et fin de phase |
| Animations de transition phase              | ❌ À faire | @legendapp/motion disponible                                            |

---

## Backlog / Idées futures

- [ ] Tab Community : partage de workouts (non prioritaire)
- [ ] Tab About : crédits, lien GitHub
- [x] Persistance de la configuration (AsyncStorage) ✅
- [ ] Widget iOS (si Expo le supporte)
- [ ] Apple Watch companion

---

## Bugs connus

Aucun bug connu.
