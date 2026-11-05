# Progression — Boxing Timer

_Dernière mise à jour : 2026-05-14_

## Statut global : 🟡 En cours (phase 3 — UX / Design)

---

## Phase 1 — Timer de base fonctionnel ✅ Terminée

| Tâche                                   | Statut  | Notes                               |
| --------------------------------------- | ------- | ----------------------------------- |
| Structure du projet (Expo Router, tabs) | ✅ Fait |                                     |
| Composant Timer avec start/pause/reset  | ✅ Fait |                                     |
| Intégration NativeWind + Gluestack      | ✅ Fait |                                     |
| Dark/light mode (mode "system")         | ✅ Fait | GluestackUIProvider mode="system"   |
| Timer configurable (durée)              | ✅ Fait | Défaut 3 min, persisté              |
| Remplacer `alert()` par feedback visuel | ✅ Fait | Banner "Terminé !" + expo-haptics   |
| Toggle unifié Start / Pause / Reprendre | ✅ Fait |                                     |

---

## Phase 2 — Fonctionnalités boxing ✅ Terminée

| Tâche                                          | Statut  | Notes                                         |
| ---------------------------------------------- | ------- | --------------------------------------------- |
| Configuration : nombre de rounds               | ✅ Fait | Défaut 3, min 1, max 100                      |
| Configuration : durée d'un round               | ✅ Fait | Défaut 180s, min 1s, max 300s                 |
| Configuration : durée du repos                 | ✅ Fait | Défaut 60s, min 1s, max 300s                  |
| Enchaînement automatique Round → Repos → Round | ✅ Fait | Machine à états idle/round/rest/done          |
| Affichage du round actuel (ex: Round 2/5)      | ✅ Fait | + label "Repos · Round X →" pendant le repos  |
| Alerte haptique 10 secondes avant fin          | ✅ Fait | ImpactFeedbackStyle.Heavy à 10s               |
| Vibration fin de phase                         | ✅ Fait | NotificationFeedbackType.Success              |

---

## Phase 3 — UX / Config / Feedback

| Tâche                                       | Statut     | Notes                                                                      |
| ------------------------------------------- | ---------- | -------------------------------------------------------------------------- |
| Configuration via modal par valeur          | ✅ Fait    | Bouton ✎ par ligne, modal centré, clavier numérique, autoFocus             |
| Persistance de la configuration             | ✅ Fait    | AsyncStorage (clé `boxing-timer-config`)                                   |
| Correction pause au changement de phase     | ✅ Fait    | Remplacé par la machine à timestamps (phase 3)          |
| Empêcher la mise en veille                  | ✅ Fait    | `useKeepAwake()` actif dès que l'écran Timer est monté                     |
| Son de cloche                               | ✅ Fait    | expo-audio · `boxing_bell.wav` · démarrage + chaque changement de phase      |
| Animations de transition de phase           | ✅ Fait    | @legendapp/motion · phase 150ms, pulsation 10s, banner 200ms, boutons 0.97                                               |

---

## Backlog / Idées futures

- [ ] Tab Community : partage de workouts (non prioritaire)
- [x] Préréglages : Amateur 3×3min/1min, Pro 12×3min/1min, Sparring 5×2min/30s
- [ ] Warmup / Cooldown optionnels
- [x] Timer circulaire (progress ring) — react-native-svg
- [ ] Notifications locales pour la cloche écran verrouillé (expo-notifications)
- [ ] Widget iOS (si Expo le supporte)

---

## Bugs connus

Aucun bug connu.
