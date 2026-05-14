# Progression — Boxing Timer

_Dernière mise à jour : 2026-05-14_

## Statut global : 🟡 En cours (phase 2 — fonctionnalités boxing)

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

## Phase 2 — Fonctionnalités boxing

| Tâche | Statut | Notes |
|---|---|---|
| Configuration : nombre de rounds | ❌ À faire | Défaut : 3 rounds |
| Configuration : durée d'un round | ❌ À faire | Défaut : 3 min |
| Configuration : durée du repos | ❌ À faire | Défaut : 1 min |
| Enchaînement automatique Round → Repos → Round | ❌ À faire | |
| Affichage du round actuel (ex: Round 2/5) | ❌ À faire | |
| Alerte 10 secondes avant fin de phase | ❌ À faire | |
| Vibrations avec expo-haptics | ❌ À faire | Package installé |
| Son de cloche / buzzer | ❌ À faire | Besoin d'expo-av ou expo-audio |

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
