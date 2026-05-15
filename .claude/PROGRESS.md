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
| Correction pause au changement de phase     | ✅ Fait    | `setTimeout(() => restart(...), 0)` — workaround react-timer-hook          |
| Empêcher la mise en veille                  | ✅ Fait    | `useKeepAwake()` actif dès que l'écran Timer est monté                     |
| Son de cloche                               | ✅ Fait    | expo-av · `boxing_bell.mp3` · démarrage + chaque changement de phase      |
| Animations de transition de phase           | ❌ À faire | @legendapp/motion disponible                                               |

---

## Backlog / Idées futures

- [ ] Tab Community : partage de workouts (non prioritaire)
- [ ] Tab About : crédits, lien GitHub
- [ ] Préréglages (ex: 3×3 amateur, 3×5 pro, Sparring)
- [ ] Warmup / Cooldown optionnels
- [ ] Timer circulaire (progress ring) — react-native-svg disponible
- [ ] Widget iOS (si Expo le supporte)
- [ ] Supprimer `ConfigSheet.tsx` (dead code)

---

## Bugs connus

Aucun bug connu.
