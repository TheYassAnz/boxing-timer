# Refonte design native — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le style maison (Gluestack + charte bleu marine) par des composants natifs SwiftUI / Material 3 via `@expo/ui`, couleurs système + accent rouge, gros boutons, nouveaux préréglages avec rounds illimités, et son claquoir sur les 10 dernières secondes d'un round.

**Architecture:** La logique pure (config, préréglages, pas de réglage, machine à états) reste dans `components/timer/config.ts` et `machine.ts`, testée avec `node:test`. Les contrôles natifs vivent dans `components/native/` avec un fichier `.ios.tsx` (`@expo/ui/swift-ui`) et un `.android.tsx` (`@expo/ui/jetpack-compose`) par composant, même props. L'écran Timer orchestre deux vues : réglages (`idle`) et séance (`round`/`rest`/`done`).

**Tech Stack:** Expo SDK 58, RN 0.88, React 19.3 + React Compiler, TypeScript strict, `@expo/ui`, NativeWind (mise en page seulement), expo-audio, expo-haptics, react-native-svg, @legendapp/motion.

**Spec:** `docs/superpowers/specs/2026-11-05-refonte-design-native-design.md`

## Global Constraints

- Lancement : **Expo Go** sur iPhone, gratuit. Aucune dépendance à code natif absente d'Expo Go. `@expo/ui` est OK (embarqué dans Expo Go). Installer avec `npx expo install`.
- iOS et Android en parité ; pas de Web.
- Direction visuelle B : fonds/textes système clair/sombre, **un seul accent : rouge** ; **vert pendant le repos**.
- Boutons de séance ronds ~80 pt ; bouton Démarrer ~96 pt.
- Plages : durées 1–300 s ; rounds 1–100 **ou illimité**.
- Préréglages exacts : Échauffement (illimité, 30 s, 30 s) · Assauts (illimité, 90 s, 35 s) · Sparring (12, 180 s, 60 s).
- Les préréglages remplissent la config ; ils ne sont jamais modifiés par l'utilisateur.
- Machine à timestamps : ne jamais décrémenter un compteur par tick (cf. `.claude/CLAUDE.md`).
- Styles : NativeWind `className` pour la mise en page ; couleurs via la palette `components/timer/theme.ts` en `style` inline ; **jamais `StyleSheet.create`**.
- Pas d'`alert()`. Pas de commentaires sauf WHY non évident.
- Ne pas stager `.claude/PROGRESS.md` sauf dans la Task 5 (l'utilisateur a des modifs locales dessus : les conserver).

## Review Focus

1. **Config stockée par l'ancienne version** (`{"rounds":3,...}` ou `rounds` hors bornes) doit se recharger sans crash et sans perdre les durées — test dans Task 1.
2. **Mode illimité + app en arrière-plan longtemps** : au retour, `tick` doit rattraper de nombreux cycles round/repos sans jamais passer en `done` — test dans Task 1.
3. **Roue iOS à 0:00 ou 5:59** : la valeur doit être bornée à 1–300 s, jamais 0 ni >300 — test `fromMinSec` dans Task 1.
4. **Claquoir déclenché plusieurs fois** (pause/reprise sous 10 s, ou retour d'arrière-plan qui saute des phases) : il ne doit jouer qu'au franchissement de 10 s dans une phase `round`, jamais pendant le repos — test `shouldClap` dans Task 2.
5. **Changement clair/sombre en pleine séance** : les couleurs suivent `useColorScheme` sans redémarrer — vérifié visuellement dans Task 6.

---

### Task 1: Config — rounds illimités, nouveaux préréglages, helpers de réglage

**Files:**
- Modify: `components/timer/config.ts`
- Modify: `components/timer/machine.ts`
- Test: `components/timer/machine.test.ts`
- Also commit: `docs/superpowers/specs/2026-11-05-refonte-design-native-design.md`, `docs/superpowers/plans/2026-11-05-refonte-design-native.md`, `.gitignore`

**Interfaces:**
- Produces (dans `config.ts`) :
  - `UNLIMITED = 0` — valeur de `Config.rounds` signifiant illimité.
  - `LIMITS.rounds = [0, 100]` (0 = illimité) ; durées inchangées `[1, 300]`.
  - `PRESETS: { label: string; config: Config }[]` = `Échauffement`, `Assauts`, `Sparring` (valeurs des Global Constraints, dans cet ordre).
  - `presetIndex(c: Config): number` — index du préréglage identique, sinon `-1`.
  - `stepRounds(n: number, delta: 1 | -1): number` — borné `[0, 100]`.
  - `stepDuration(s: number, delta: 1 | -1): number` — pas de 5 s aligné sur les multiples de 5, borné `[1, 300]`.
  - `fromMinSec(m: number, s: number): number` — secondes bornées `[1, 300]`.
  - `fmtClock(s: number): string` — `"m:ss"` (ex. `35 → "0:35"`, `180 → "3:00"`).
  - `roundLabel(round: number, rounds: number): string` — `"Round 2 / 12"`, ou `"Round 7"` si illimité.
  - Supprimer `fmtDuration` s'il n'a plus d'appelant après Task 4 (vérifier par grep à la Task 4).
- Produces (dans `machine.ts`) : `tick` traite `cfg.rounds === UNLIMITED` comme « toujours un round suivant ».

- [ ] **Step 1: Écrire les tests qui échouent** (dans `machine.test.ts`, remplacer le test des préréglages)

```ts
import { fmtClock, fromMinSec, parseConfig, presetIndex, PRESETS, roundLabel, sameConfig, stepDuration, stepRounds, UNLIMITED } from "./config";

test("préréglages exacts", () => {
  assert.deepEqual(PRESETS.map((p) => [p.label, p.config]), [
    ["Échauffement", { rounds: UNLIMITED, roundDuration: 30, restDuration: 30 }],
    ["Assauts", { rounds: UNLIMITED, roundDuration: 90, restDuration: 35 }],
    ["Sparring", { rounds: 12, roundDuration: 180, restDuration: 60 }],
  ]);
  for (const p of PRESETS) assert.deepEqual(parseConfig(JSON.stringify(p.config)), p.config);
});

test("presetIndex reconnaît ou renvoie -1", () => {
  assert.equal(presetIndex(PRESETS[2].config), 2);
  assert.equal(presetIndex({ ...PRESETS[2].config, rounds: 6 }), -1);
});

test("config de l'ancienne version rechargée", () => {
  assert.deepEqual(parseConfig('{"rounds":3,"roundDuration":180,"restDuration":60}'), { rounds: 3, roundDuration: 180, restDuration: 60 });
  assert.equal(parseConfig('{"rounds":-4}').rounds, 0);
  assert.equal(parseConfig('{"rounds":500}').rounds, 100);
});

test("stepRounds passe par illimité et borne", () => {
  assert.equal(stepRounds(1, -1), 0);
  assert.equal(stepRounds(0, -1), 0);
  assert.equal(stepRounds(0, 1), 1);
  assert.equal(stepRounds(100, 1), 100);
});

test("stepDuration aligne sur 5 s et borne 1–300", () => {
  assert.equal(stepDuration(1, 1), 5);
  assert.equal(stepDuration(33, 1), 35);
  assert.equal(stepDuration(33, -1), 30);
  assert.equal(stepDuration(5, -1), 1);
  assert.equal(stepDuration(1, -1), 1);
  assert.equal(stepDuration(300, 1), 300);
});

test("fromMinSec borne 1–300", () => {
  assert.equal(fromMinSec(0, 0), 1);
  assert.equal(fromMinSec(1, 30), 90);
  assert.equal(fromMinSec(5, 59), 300);
});

test("libellés", () => {
  assert.equal(fmtClock(35), "0:35");
  assert.equal(fmtClock(180), "3:00");
  assert.equal(roundLabel(2, 12), "Round 2 / 12");
  assert.equal(roundLabel(7, UNLIMITED), "Round 7");
});

test("illimité : ne termine jamais et rattrape l'arrière-plan", () => {
  const u = { rounds: UNLIMITED, roundDuration: 3, restDuration: 2 };
  const r = tick(start(u, 0), u, 5 * 50 + 1);
  assert.notEqual(r.state.phase, "done");
  assert.equal(r.state.round, 51);
  assert.equal(r.transitions, 100);
});
```

Mettre à jour le test existant `parseConfig borne…` : `rounds: 500 → 100` reste vrai ; aucune autre attente ne change.

- [ ] **Step 2: Lancer et vérifier l'échec**

Run: `npm test`
Expected: FAIL (`UNLIMITED`, `presetIndex`, etc. non exportés).

- [ ] **Step 3: Implémenter** les exports listés dans Interfaces dans `config.ts`, et dans `machine.ts` remplacer la condition `state.round < cfg.rounds` par `(cfg.rounds === UNLIMITED || state.round < cfg.rounds)`. `DEFAULTS` = config du préréglage Sparring.

- [ ] **Step 4: Lancer et vérifier le succès**

Run: `npm test`
Expected: tous les tests PASS.

- [ ] **Step 5: Commit**

```bash
git add components/timer/config.ts components/timer/machine.ts components/timer/machine.test.ts docs/superpowers .gitignore
git commit -m "feat: rounds illimités et préréglages Échauffement/Assauts/Sparring"
```

---

### Task 2: Sons — claquoir sur les 10 dernières secondes d'un round

**Files:**
- Create: `assets/sounds/clapper.wav` (ou `.mp3`), `assets/sounds/CREDITS.md`
- Create: `hooks/useSound.ts` ; Delete: `hooks/useBell.ts`
- Modify: `components/timer/machine.ts` (ajout `shouldClap`), `hooks/useBoxingTimer.ts`
- Test: `components/timer/machine.test.ts`

**Interfaces:**
- Produces : `useSound(source: number): () => void` (même logique que l'actuel `useBell` : `seekTo(0)` puis `play()`).
- Produces : `shouldClap(prev: TimerState, next: TimerState, transitions: number): boolean` dans `machine.ts` — vrai seulement si `transitions === 0`, `next.phase === "round"`, `secondsLeft(prev) > 10` et `secondsLeft(next) <= 10`.
- Produces : `useBoxingTimer(config: Config, sounds: { bell: () => void; clap: () => void })` — remplace le paramètre `onBell`.

- [ ] **Step 1: Trouver le son.** Chercher un claquoir de boxe (« boxing clapper », « wood clapper », « 10 second clapper ») **CC0** sur freesound.org ou équivalent. Clip court (~1–2 s, plusieurs « clac »). **Demander à l'utilisateur l'autorisation de télécharger** (nom, source, taille), puis lui faire écouter le fichier (SendUserFile) et attendre son accord avant de continuer. Noter titre, auteur, URL et licence dans `assets/sounds/CREDITS.md` (ajouter aussi la cloche : « fournie par l'utilisateur »).

- [ ] **Step 2: Écrire le test qui échoue**

```ts
test("shouldClap : franchissement des 10 s en round uniquement", () => {
  const c = { rounds: 3, roundDuration: 30, restDuration: 30 };
  const s = start(c, 0);
  const a = tick(s, c, 19_500);
  const b = tick(a.state, c, 20_100);
  assert.equal(shouldClap(a.state, b.state, b.transitions), true);
  const b2 = tick(b.state, c, 20_400);
  assert.equal(shouldClap(b.state, b2.state, b2.transitions), false);
  const rest = tick(s, c, 30_000).state;
  const r1 = tick(rest, c, 49_500), r2 = tick(r1.state, c, 50_100);
  assert.equal(r2.state.phase, "rest");
  assert.equal(shouldClap(r1.state, r2.state, r2.transitions), false);
  const jump = tick(s, c, 81_000);
  assert.equal(shouldClap(s, jump.state, jump.transitions), false);
});
```

- [ ] **Step 3: Lancer** `npm test` → FAIL (`shouldClap` non exporté).

- [ ] **Step 4: Implémenter** `shouldClap`, `useSound`, et brancher dans `useBoxingTimer` : à chaque tick, si `transitions > 0` → `bell()` + haptique Success (inchangé) ; sinon si `shouldClap(...)` → `clap()` ; l'haptique Heavy à 10 s reste inchangée (round et repos). Supprimer `useBell.ts`, mettre à jour l'appelant dans `components/timer/index.tsx` (`useSound(require("@/assets/sounds/boxing_bell.wav"))` et le claquoir).

- [ ] **Step 5: Lancer** `npm test` → PASS ; `npx tsc --noEmit` → aucune erreur.

- [ ] **Step 6: Commit**

```bash
git add assets/sounds hooks components/timer/machine.ts components/timer/machine.test.ts components/timer/index.tsx
git commit -m "feat: claquoir sur les 10 dernières secondes d'un round"
```

---

### Task 3: Palette système et contrôles natifs

**Files:**
- Create: `components/timer/theme.ts`
- Create: `components/native/RoundButton.ios.tsx`, `RoundButton.android.tsx`
- Create: `components/native/PresetPicker.ios.tsx`, `PresetPicker.android.tsx`
- Create: `components/native/SettingsList.ios.tsx`, `SettingsList.android.tsx`
- Modify: `package.json` (via `npx expo install @expo/ui`)

**Interfaces:**
- Consumes : `Config`, `PRESETS`, `presetIndex`, `stepRounds`, `stepDuration`, `fromMinSec`, `fmtClock`, `UNLIMITED` (Task 1).
- Produces :
  - `usePalette(phase: Phase): { bg: string; groupedBg: string; text: string; secondary: string; accent: string; track: string; neutral: string }` — hex selon `Platform.OS` et `useColorScheme()`. Valeurs : iOS rouge `#FF3B30`/`#FF453A` (clair/sombre), vert `#34C759`/`#30D158`, fonds `#FFFFFF`/`#000000`, groupé `#F2F2F7`/`#000000`, texte `#000000`/`#FFFFFF`, secondaire `#8E8E93`. Android : fonds surface M3 `#FEF7FF`/`#141218`, texte `#1D1B20`/`#E6E0E9`, rouge `#B3261E`/`#F2B8B5`, vert `#146C2E`/`#7DDB8A`. `accent` = vert si `phase === "rest"`, sinon rouge.
  - `RoundButton(props: { label: string; onPress: () => void; tone: "accent" | "neutral"; size: number; color: string; disabled?: boolean })` — bouton natif rond (iOS : `Button` SwiftUI, cercle `size`×`size`, fond teinté atténué + libellé couleur pleine comme l'app Horloge ; Android : `Button` Compose, forme ronde/pleine Material). Cible tactile = `size` entier.
  - `PresetPicker(props: { labels: string[]; selectedIndex: number; onSelect: (i: number) => void })` — iOS : `Picker` SwiftUI style segmenté ; `selectedIndex === -1` → aucun segment sélectionné. Android : `SingleChoiceSegmentedButtonRow` + `SegmentedButton`.
  - `SettingsList(props: { config: Config; onChange: (c: Config) => void; tint: string })` — 3 lignes : Rounds (stepper − / + via `stepRounds`, affiche `"Illimité"` si `UNLIMITED`), Durée du round, Repos. iOS : `Form`/`Section` ; Rounds en `Stepper` natif ; toucher une ligne de durée déplie inline deux `Picker` style roue (minutes 0–5, secondes 0–59) → `fromMinSec`. Android : liste Material, durées en `m:ss` (`fmtClock`) avec boutons − / + (`stepDuration`).

- [ ] **Step 1: Installer** `npx expo install @expo/ui`. Lire les types installés (`node_modules/@expo/ui/build/swift-ui/index.d.ts`, `.../jetpack-compose/index.d.ts`, `.../swift-ui/modifiers/index.d.ts`) pour confirmer les noms exacts : `Host`, `Button`, `Picker`, `Stepper`, `Form`, `Section`, modifiers `pickerStyle`, `buttonStyle`, `controlSize`, `tint`, `frame` côté SwiftUI ; `Host`, `Button`, `SingleChoiceSegmentedButtonRow`, `SegmentedButton`, `IconButton`/`FilledTonalIconButton`, `ListItem` côté Compose. Si un composant listé n'existe pas, prendre l'équivalent natif le plus proche exporté et le noter dans le rapport de tâche.

- [ ] **Step 2: Implémenter** `theme.ts` puis les 6 fichiers natifs avec les props ci-dessus. Chaque contrôle est rendu dans son propre `Host` (`matchContents` pour les boutons). Aucun `StyleSheet.create`.

- [ ] **Step 3: Vérifier** `npx tsc --noEmit` et `npm run lint` → aucune erreur.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json components/native components/timer/theme.ts
git commit -m "feat: palette système et contrôles natifs @expo/ui"
```

---

### Task 4: Écran Timer — réglages, séance, fin

**Files:**
- Modify: `components/timer/index.tsx`, `components/timer/ProgressRing.tsx` (si besoin d'épaisseur)
- Delete: `components/timer/ConfigRow.tsx`, `components/timer/EditModal.tsx`

**Interfaces:**
- Consumes : tout ce que produisent les Tasks 1–3 ; `useBoxingTimer(config, { bell, clap })`.

- [ ] **Step 1: Réécrire `index.tsx`** :
  - Fond `palette.bg` (réglages : `palette.groupedBg` sur iOS).
  - **Phase `idle`** : titre « Timer » (grand titre système), `PresetPicker` (`labels` = `PRESETS.map(p => p.label)`, `selectedIndex = presetIndex(config)`, `onSelect` → `setConfig(PRESETS[i].config)`), `SettingsList`, puis `RoundButton` « Démarrer » `size={96}` `tone="accent"` en bas.
  - **Phases `round`/`rest`/`done`** : libellé (`roundLabel(currentRound, config.rounds)`, ou « Repos » pendant le repos), `ProgressRing` couleur `palette.accent` / piste `palette.track`, chiffres `mm:ss` plus grands (≥ `text-8xl`), graisse légère, `fontVariant: ["tabular-nums"]`, statut sous les chiffres. Deux `RoundButton` `size={80}` : « Réinitialiser » (gauche, `tone="neutral"`, appui simple) et « Pause » / « Reprendre » (droite, `tone="accent"`).
  - **`done`** : « Terminé » affiché à la place du statut ; bouton droit désactivé ; Réinitialiser revient aux réglages.
  - Garder : `useKeepAwake`, pulsation des 10 s, transition de phase `Motion.View` (styles sur un `View` enfant, cf. CLAUDE.md).
- [ ] **Step 2: Supprimer** `ConfigRow.tsx`, `EditModal.tsx` ; grep `fmtDuration` et le supprimer de `config.ts` s'il n'est plus utilisé.
- [ ] **Step 3: Vérifier** `npm test`, `npx tsc --noEmit`, `npm run lint` → OK.
- [ ] **Step 4: Commit**

```bash
git add -A components/timer
git commit -m "feat: écran Timer natif (réglages, séance, fin)"
```

---

### Task 5: Retrait de Gluestack, Community, docs

**Files:**
- Modify: `app/_layout.tsx` (retirer `GluestackUIProvider`, garder `@/global.css`), `app/(tabs)/community.tsx` (palette + couleurs système, accent rouge), `app/(tabs)/_layout.tsx` (teinte d'accent des `NativeTabs` = rouge de la palette), `tailwind.config.js` (retirer palette `boxing-*` et tokens Gluestack ; garder `nativewind/preset` et `content`), `package.json`
- Delete: `components/ui/`
- Modify: `.claude/CLAUDE.md`, `.claude/CHARTE.md`, `.claude/PROGRESS.md`

- [ ] **Step 1:** Supprimer `components/ui/` et désinstaller `@gluestack-ui/core`, `@gluestack-ui/utils`, `react-aria`, `react-stately`, `tailwind-variants` après avoir vérifié par grep qu'aucun fichier restant ne les importe. Grep `boxing-` dans `app/` et `components/` → zéro résultat.
- [ ] **Step 2:** Mettre à jour la doc : `CLAUDE.md` (stack : `@expo/ui` à la place de Gluestack ; conventions : composants natifs dans `components/native/*.ios|android.tsx`, couleurs via `theme.ts`, lancement Expo Go ; préréglages et illimité ; claquoir), `CHARTE.md` (réécrite : direction B, valeurs de `theme.ts`, tailles 80/96 pt), `PROGRESS.md` (ajouter une ligne « Refonte design native ✅ » au-dessus de « Backlog » et « Cloche écran verrouillé (notifications programmées) » dans le Backlog, **sans écraser** le contenu local existant).
- [ ] **Step 3: Vérifier** `npm test`, `npx tsc --noEmit`, `npm run lint`, `npx expo start` démarre sans erreur de bundle.
- [ ] **Step 4: Commit**

```bash
git add -A app components package.json package-lock.json tailwind.config.js .claude/CLAUDE.md .claude/CHARTE.md .claude/PROGRESS.md
git commit -m "refactor: retire Gluestack et la charte bleu marine, doc à jour"
```

---

### Task 6: Vérification visuelle « nickel »

- [ ] **Step 1:** Lancer dans Expo Go sur le simulateur iOS (`npm run ios`) et, si disponible, l'émulateur Android (`npm run android`). Pour chaque plateforme, en **clair et sombre**, capturer : réglages (préréglage surligné ; aucun surligné après modification), roue iOS ouverte / boutons − / + Android, round en cours, repos (vert), 10 dernières secondes (pulsation + claquoir), mode illimité (« Round N » sans total), fin (« Terminé »), tab Community.
- [ ] **Step 2:** Basculer clair → sombre en pleine séance : les couleurs suivent sans redémarrage.
- [ ] **Step 3:** Corriger tout défaut d'alignement, de troncature de libellé ou d'incohérence entre écrans ; re-vérifier. Envoyer les captures à l'utilisateur (SendUserFile).
- [ ] **Step 4:** Commit des corrections éventuelles : `git commit -m "fix: finitions visuelles"`.
