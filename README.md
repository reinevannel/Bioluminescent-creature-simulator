# 🌌 Bioluminescent Creature Simulator  
Interactive simulator of bioluminescent creatures based on fictional DNA sequences.  
Project created as part of the **Codecademy – Front-End Developer** path.

This fictional laboratory allows you to explore the impact of genetic mutations on the stability, survival, and adaptation of abyssal organisms.  
The interface includes a **complete case study** (wireframes, UI design, flows) integrated into the code and used as the foundation for development.

---

## 🧬 Concept  
Each creature is generated from a dynamic DNA sequence.  
The user can:

- mutate the sequence,
- observe the effects on survival,
- visualize the bioluminescent creature,
- archive specimens,
- analyze genetic statistics.

This project combines **narrative design**, **scientific visualization**, and **front-end interactions**.

---

## 🔬 Main Features

### 🎛️ Mutation Engine  
A mutation engine allows you to modify the DNA sequence:

- `Mutate` — single-point mutation  
- `Mutate ×5` — rapid series  
- `Mutate ×10` — intensive mutations  
- `Randomize` — completely new sequence  
- `Complement` — complementary sequence  
- `Save to Archive` — preserve the specimen

Each action influences:

- **GC Content**  
- **Genomic stability**  
- **Survival probability**  
- **Depth adaptation**

---

## 🗃️ Specimen Archive  
Saved creatures can be viewed in a dedicated interface:

- DNA overview (bases + preview),
- visual rendering of the creature,
- key statistics (GC, mutations, survival, depth),
- variant badge,
- quick open in the laboratory.

The archive allows you to track the evolution of organisms throughout the experiments.

---

## 🎨 Design & UX  
This project includes a **complete Figma case study**, integrated into the code:

- wireframes,  
- information architecture,  
- bioluminescent UI design,  
- abyssal color palette (cyan, violet, pink, teal),  
- scientific typography (mono + display),  
- dynamic components (Creature renderer, Stat blocks),  
- micro-interactions (hover, glow, scale).

The simulator is designed as an **immersive experience**, inspired by oceanographic research interfaces.

---

## 🛠️ Tech Stack

- **Framework:** React  
- **State & logic:** custom hooks (lab-context)  
- **UI:** Tailwind CSS + custom components  
- **Icons:** lucide-react  
- **Animations:** CSS transitions & motion classes  
- **Architecture:** separated modules (lab, archive, model, primitives)

---

## 🚀 Local Demo

To run the project locally:

1. Install **Node.js**.  
2. Open the project folder in your terminal.  
3. Install the dependencies:

   `npm install`

4. Start the development server:

   `npm run dev`

5. Open the local URL displayed in the terminal (e.g. http://localhost:5173).

You can now explore the simulator directly in your browser.

---

## 💡 Windows Note (personal)

On my Windows environment, npm automatically uses the `npm.cmd` launcher.  
During project installation, I had to approve the esbuild installation script:

- `npm.cmd install-scripts approve esbuild`
- `npm.cmd rebuild esbuild`

This is normal behavior on Windows: some packages like **esbuild** require manual validation to allow their post-install scripts.  
Once approved, the development server starts normally with:

`npm run dev`

---

## The 4 Screens

| Route | Screen |
| --- | --- |
| `/` | Lab — DNA, mutation, complement, save |
| `/archive` | Specimen archive |
| `/evolution` | Simulation over 21 generations |
| `/design` | Design system case study |

Lab shortcuts: `M` mutate, `R` random sequence, `C` complement, `S` save, `N` new specimen.

## Where is the code

| File | Role |
| --- | --- |
| `src/main.tsx` | Entry point |
| `src/styles.css` | Tailwind + colors + animations |
| `src/lib/nav.tsx` | Navigation between the 4 pages |
| `src/features/aequor/model.ts` | DNA rules, without React |
| `src/features/aequor/lab-context.tsx` | Laboratory state |
| `src/features/aequor/lab-view.tsx` | Lab screen |
| `src/features/aequor/archive-view.tsx` | Archive |
| `src/features/aequor/evolution-view.tsx` | Evolution |
| `src/features/aequor/design-view.tsx` | Case study |
| `src/features/aequor/creature.tsx` | SVG creature |
| `src/features/aequor/shell.tsx` | Header and menu |
| `src/features/aequor/storage.ts` | Local storage |



## 🌊 Summary  
This simulator is entirely **fictional**.  
The creatures, genetic data, and abyssal environments are invented to create an interactive and artistic experience.

---
## 📄 License  
Open-source project intended for front-end and UX/UI demonstration.  
Free to use for learning, experimentation, or inspiration.
