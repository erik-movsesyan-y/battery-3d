# Lead-Acid Battery Designer (React + Vite + Three.js + MUI)

Interactive calculator and 3D visualizer for a 12V lead-acid battery.  
The app computes plate counts and case dimensions from electrochemical inputs (based on the provided Armenian formulas), then renders two battery views (external and cutaway) using `@react-three/fiber`.

## ✨ Features

- 🔢 **Calculator**: Computes
  - Actual capacity `Qₚ = 1.2 · Qₙ`
  - Positive/negative PbSO₄ masses (`G_PbSO₄⁺`, `G_PbSO₄⁻`)
  - Positive active mass `G⁺`
  - Plate counts `N⁺`, `N⁻ = N⁺ + 1`
  - Internal/External dimensions (A, B, C) in mm
- 🧮 **User Inputs** (with ranges where applicable):
  - `Qn` (nominal Ah), `K_usage_plus` (0.55–0.65), `a_plus_PbSO4` (0.90–0.93), `a_minus_PbSO4` (0.94–0.96)
  - Geometry: `l_plus`, `h_plus`, `delta_l_sep (2.5–3.5)`, `delta_h`, `wall_thk`, `lid_thk`, `base_thk`, `bonnet_h` (mm)
- 🧰 **Preset button**: Load example values (6ST92L) instantly.
- 🧊 **3D Visualization**: External case + cutaway with interleaved plates & separators, terminals, lid, handle, dimension lines, and a legend.
- 🧱 **Tech Stack**: React + Vite, Material UI, @react-three/fiber, drei.

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** (or `pnpm`/`yarn` if you prefer)

### Installation

```bash
# clone
git clone <your-repo-url>.git
cd <your-repo-name>

# install deps
npm install
