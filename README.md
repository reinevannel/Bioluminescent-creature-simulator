# 🌌 Bioluminescent Creature Simulator  
Simulateur interactif de créatures bioluminescentes basé sur des séquences ADN fictives.  
Projet réalisé dans le cadre du parcours **Codecademy – Front-End Developer**.

Ce laboratoire fictif permet d’explorer l’impact des mutations génétiques sur la stabilité, la survie et l’adaptation d’organismes abyssaux.  
L’interface inclut un **case study complet** (wireframes, UI design, flows) intégré au code et servant de base au développement.

---

## 🧬 Concept  
Chaque créature est générée à partir d’une séquence ADN dynamique.  
L’utilisateur peut :

- muter la séquence,
- observer les effets sur la survie,
- visualiser la créature bioluminescente,
- archiver les spécimens,
- analyser les statistiques génétiques.

Ce projet combine **design narratif**, **visualisation scientifique**, et **interactions front-end**.

---

## 🔬 Fonctionnalités principales

### 🎛️ Mutation Engine  
Un moteur de mutation permet de modifier la séquence ADN :

- `Mutate` — mutation ponctuelle  
- `Mutate ×5` — série rapide  
- `Mutate ×10` — mutations intensives  
- `Randomize` — nouvelle séquence complète  
- `Complement` — séquence complémentaire  
- `Save to Archive` — préservation du spécimen

Chaque action influence :

- **GC Content**  
- **Stabilité génomique**  
- **Probabilité de survie**  
- **Adaptation à la profondeur**

---

## 🗃️ Archive des spécimens  
Les créatures sauvegardées sont consultables dans une interface dédiée :

- aperçu ADN (bases + preview),
- rendu visuel de la créature,
- statistiques clés (GC, mutations, survie, profondeur),
- badge de variante,
- ouverture rapide dans le laboratoire.

L’archive permet de suivre l’évolution des organismes au fil des expérimentations.

---

## 🎨 Design & UX  
Ce projet inclut un **case study Figma complet**, intégré au code :

- wireframes,  
- structure d’information,  
- UI design bioluminescent,  
- palette abyssale (cyan, violet, rose, teal),  
- typographies scientifiques (mono + display),  
- composants dynamiques (Creature renderer, Stat blocks),  
- micro‑interactions (hover, glow, scale).

Le simulateur est conçu comme une **expérience immersive**, inspirée des interfaces de recherche océanique.

---

## 🛠️ Stack technique

- **Framework :** React  
- **State & logique :** hooks personnalisés (lab-context)  
- **UI :** Tailwind CSS + composants maison  
- **Icônes :** lucide-react  
- **Animations :** transitions CSS & motion classes  
- **Architecture :** modules séparés (lab, archive, model, primitives)

---

## 🚀 Démo locale

Pour exécuter le projet en local :

1. Installez **Node.js**.  
2. Ouvrez le dossier du projet dans votre terminal.  
3. Installez les dépendances :

   `npm install`

4. Lancez le serveur de développement :

   `npm run dev`

5. Ouvrez l’URL locale affichée dans le terminal (ex. http://localhost:5173).

Vous pouvez maintenant explorer le simulateur directement dans votre navigateur.

   
## 💡 Note Windows (personnelle)

Sur mon environnement Windows, npm utilise automatiquement le lanceur `npm.cmd`.  
Lors de l’installation du projet, j’ai dû approuver le script d’installation d’esbuild :

- `npm.cmd install-scripts approve esbuild`
- `npm.cmd rebuild esbuild`

C’est un comportement normal sur Windows : certains packages comme **esbuild** nécessitent une validation manuelle pour autoriser leurs scripts post-installation.  
Une fois approuvé, le serveur de développement démarre normalement avec :

`npm run dev`

---

## 🌊 Récapitulatif  
Ce simulateur est entièrement **fictionnel**.  
Les créatures, données génétiques et environnements abyssaux sont inventés pour créer une expérience interactive et artistique.

---

## 📄 Licence  
Projet open-source destiné à la démonstration front-end et UX/UI.  
Utilisation libre pour l’apprentissage, l’expérimentation ou l’inspiration.
