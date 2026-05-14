# Charte graphique — Boxing Timer

## Palette de couleurs

### Couleurs de base

| Nom | Hex | Rôle |
|---|---|---|
| `white` | `#e7ecef` | Texte principal (dark), fond principal (light) |
| `navy` | `#274c77` | Surface/cartes (dark), texte principal (light) |
| `blue` | `#6096ba` | Action primaire, interactifs |
| `sky` | `#a3cef1` | Accent secondaire, highlights, badges |
| `alert` | `#ef233c` | Fin de round, warnings, actions destructives |

### Mode sombre (dark)

| Élément | Couleur |
|---|---|
| Fond principal | `#0d1b2a` (dérivé navy, plus sombre) |
| Fond surface (cartes, panels) | `#274c77` |
| Texte principal | `#e7ecef` |
| Texte secondaire | `#a3cef1` |
| Action primaire (bouton Start) | `#6096ba` |
| Alerte / Danger | `#ef233c` |
| Désactivé | `#274c77` à 40% d'opacité |

### Mode clair (light)

| Élément | Couleur |
|---|---|
| Fond principal | `#e7ecef` |
| Fond surface (cartes, panels) | `#ffffff` |
| Texte principal | `#274c77` |
| Texte secondaire | `#6096ba` |
| Action primaire (bouton Start) | `#274c77` |
| Alerte / Danger | `#ef233c` |
| Désactivé | `#274c77` à 30% d'opacité |

---

## Typographie

### Hiérarchie

| Usage | Famille | Poids | Taille | Exemple |
|---|---|---|---|---|
| Timer (affichage principal) | Monospace système (`font-mono`) | Black (900) | `text-8xl` (96px) | `02:45` |
| Titre d'écran | Système sans-serif | Bold (700) | `text-3xl` (30px) | `Round 2 / 5` |
| Label de bouton | Système sans-serif | SemiBold (600) | `text-lg` (18px) | `DÉMARRER` |
| Statut / sous-titre | Système sans-serif | Regular (400) | `text-base` (16px) | `En cours` |
| Légendes / hints | Système sans-serif | Light (300) | `text-sm` (14px) | `Repos : 1 min` |

### Règles typo

- **Timer** : toujours en majuscules implicites via `font-mono font-black`, tracking large (`tracking-widest`).
- **Boutons** : texte en majuscules (`uppercase`), `font-semibold`.
- **Pas de serif** — la sportivité passe par le sans-serif bold.
- Pas de font custom pour l'instant (ajouter `expo-google-fonts/bebas-neue` si on veut aller plus loin).

---

## Formes et rayons

Style : **pill (très arrondi)**. Cohérence maximale sur tous les éléments.

| Élément | Border radius |
|---|---|
| Boutons principaux | `rounded-full` |
| Cartes / panels | `rounded-3xl` (24px) |
| Badges / tags | `rounded-full` |
| Inputs | `rounded-full` |
| Alertes / banners | `rounded-full` |

---

## Boutons

### Variantes

| Variante | Dark | Light | Usage |
|---|---|---|---|
| Primary (Start) | `bg-[#6096ba]` texte blanc | `bg-[#274c77]` texte blanc | Action principale |
| Secondary (Pause) | `bg-[#274c77]` texte `#e7ecef` | `bg-[#e7ecef]` texte `#274c77` | Action secondaire |
| Danger (Reset) | `bg-[#ef233c]` texte blanc | identique | Actions destructives |
| Ghost | transparent, bordure `#6096ba` | transparent, bordure `#274c77` | Actions tertiaires |

### Tailles

| Taille | Padding H | Hauteur | Usage |
|---|---|---|---|
| `xl` | `px-8` | `h-14` (56px) | Boutons timer (Start, Pause) |
| `lg` | `px-6` | `h-11` (44px) | Boutons secondaires |
| `md` | `px-5` | `h-10` (40px) | Boutons dans les modals |

---

## Espacement

Grille de base : **8px** (Tailwind par défaut).

| Contexte | Valeur |
|---|---|
| Padding écran | `px-6` (24px) |
| Gap entre boutons | `gap-4` (16px) |
| Marge après timer | `mt-10` (40px) |
| Marge entre sections | `mt-8` (32px) |

---

## Composant Timer — spec visuelle

```
┌──────────────────────────┐
│                          │
│   ROUND 2 / 5            │  ← text-xl bold, secondaire
│                          │
│       02:45              │  ← text-8xl mono black, centré
│                          │
│       En cours           │  ← text-base, secondaire
│                          │
│  [  PAUSE  ] [ RESET ]   │  ← rounded-full, xl
│                          │
└──────────────────────────┘
```

- Le timer est **centré verticalement** dans l'écran.
- En phase `Repos` : fond surface change légèrement (`#1a3a5c` en dark) pour distinguer visuellement.
- En phase `Fin` : banner pill rouge en haut de l'écran (position absolute, top-16).

---

## Animations

| Événement | Animation |
|---|---|
| Transition Round → Repos | Fade + slide up (150ms) |
| Alerte 10s avant fin | Pulsation sur le chiffre (scale 1.02 → 1, toutes les 500ms) |
| Appui bouton | Scale down 0.97 (react-native Pressable, natif) |
| Banner "Terminé !" | Slide down depuis le haut (200ms) |

Librairie : `@legendapp/motion` (déjà installée).

---

## Iconographie

- Famille : **MaterialCommunityIcons** (déjà utilisée dans la navigation).
- Taille standard : `24px` dans la nav, `32px` dans les écrans.
- Couleur : toujours alignée sur le texte secondaire du mode actif.

---

## Implémentation NativeWind

Ajouter les couleurs custom dans `tailwind.config.js` :

```js
theme: {
  extend: {
    colors: {
      boxing: {
        white: "#e7ecef",
        navy: "#274c77",
        blue: "#6096ba",
        sky: "#a3cef1",
        alert: "#ef233c",
      },
    },
  },
},
```

Utilisation : `bg-boxing-navy`, `text-boxing-sky`, `border-boxing-alert`, etc.
