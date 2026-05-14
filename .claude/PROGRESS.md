# Progression — Boxing Timer

_Dernière mise à jour : 2026-05-14_

## Statut global : 🟡 En cours (phase 1 — base fonctionnelle)

---

## Phase 1 — Timer de base fonctionnel

| Tâche | Statut | Notes |
|---|---|---|
| Structure du projet (Expo Router, tabs) | ✅ Fait | |
| Composant Timer avec start/pause/reset | ✅ Fait | 10s hardcodé, à corriger |
| Intégration NativeWind + Gluestack | ✅ Fait | |
| Dark mode configuré | ✅ Fait | Incohérence bg-white dans Timer |
| Timer hardcodé → durée configurable | ❌ À faire | |
| Remplacer `alert()` par feedback visuel | ❌ À faire | |
| Corriger bouton Start (resume → start) | ❌ À faire | |
| Cohérence dark mode dans Timer | ❌ À faire | |

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

| Bug | Priorité | Description |
|---|---|---|
| Timer hardcodé à 10s | Haute | `app/(tabs)/index.tsx:5` et `components/timer/index.tsx:29` |
| `alert()` en fin de timer | Haute | UX bloquante, remplacer par feedback visuel + haptique |
| Bouton Start appelle `resume()` | Moyenne | Devrait appeler `start()` au premier lancement |
| bg-white dans Timer en dark mode | Basse | Incohérent avec `GluestackUIProvider mode="dark"` |
