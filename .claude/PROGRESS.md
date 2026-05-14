# Progression — Boxing Timer

_Dernière mise à jour : 2026-05-14_

## Statut global : 🟡 En cours (phase 3 — UX / Design)

---

## Phase 1 — Timer de base fonctionnel ✅ Terminée

| Tâche | Statut | Notes |
|---|---|---|
| Structure du projet (Expo Router, tabs) | ✅ Fait | |
| Composant Timer avec start/pause/reset | ✅ Fait | |
| Intégration NativeWind + Gluestack | ✅ Fait | |
| Dark mode configuré | ✅ Fait | |
| Timer hardcodé → durée configurable | ✅ Fait | Prop `durationSeconds`, défaut 3 min |
| Remplacer `alert()` par feedback visuel | ✅ Fait | Banner "Terminé !" + expo-haptics |
| Corriger bouton Start (resume → start) | ✅ Fait | Toggle unifié Start/Pause/Reprendre |
| Cohérence dark mode dans Timer | ✅ Fait | bg-background-950, text-typography-0 |

---

## Phase 2 — Fonctionnalités boxing ✅ Terminée

| Tâche | Statut | Notes |
|---|---|---|
| Configuration : nombre de rounds | ✅ Fait | Défaut 3, min 1, max 12 |
| Configuration : durée d'un round | ✅ Fait | Défaut 3 min, pas de 1 min, max 10 min |
| Configuration : durée du repos | ✅ Fait | Défaut 1 min, pas de 30s, max 3 min |
| Enchaînement automatique Round → Repos → Round | ✅ Fait | Machine à états idle/round/rest/done |
| Affichage du round actuel (ex: Round 2/5) | ✅ Fait | + label "Repos · Round X →" pendant le repos |
| Alerte 10 secondes avant fin de phase | ✅ Fait | Haptic ImpactFeedbackStyle.Heavy à 10s |
| Vibrations avec expo-haptics | ✅ Fait | Notification à chaque fin de phase |
| Son de cloche / buzzer | ⏭️ Reporté | Phase 3 — besoin d'expo-av |

---

## Phase 3 — UX / Design

| Tâche | Statut | Notes |
|---|---|---|
| Timer circulaire (progress ring) | ❌ À faire | react-native-svg disponible |
| Animations de transition phase | ❌ À faire | @legendapp/motion disponible |
| Écran de configuration dédié | ❌ À faire | Modal ou screen séparé |
| Préréglages (ex: 3x3, 5x3, Sparring) | ❌ À faire | |
| Warmup / Cooldown optionnels | ❌ À faire | |
| Empêcher la mise en veille pendant le timer | ❌ À faire | `expo-keep-awake` à installer |

---

## Backlog / Idées futures

- [ ] Tab Community : partage de workouts (non prioritaire)
- [ ] Tab About : crédits, lien GitHub
- [ ] Persistance de la configuration (AsyncStorage ou expo-secure-store)
- [ ] Widget iOS (si Expo le supporte)
- [ ] Apple Watch companion

---

## Bugs connus

Aucun bug connu en Phase 1.
