# Contributing to HULOG

Thank you for your interest in contributing to **HULOG: IoT-Enabled Dynamic QR Parcel Drop Vault**.

This project is developed under the **Technopreneurship & Real-Time Systems (RTS)** curriculum at the **University of Makati — College of Computer Science (CCIS)**.

---

## 🛠️ Development Workflow

### 1. Branching Strategy
- `main`: Production-ready code, official submission releases, and tested firmware builds.
- `feature/*`: New firmware modules, web app views, simulator improvements, or hardware test scripts.
- `docs/*`: Updates to schematics, bill of materials, thesis defense guides, or API specifications.

### 2. Commit Message Standards
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat`: A new feature (e.g., `feat(firmware): add debounced reed switch interrupt handler`)
- `fix`: A bug fix (e.g., `fix(web): resolve dynamic token expiry timestamp format`)
- `docs`: Documentation only changes (e.g., `docs: update LM2596 wiring schematic`)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `style`: Changes that do not affect the meaning of the code (formatting, white-space)
- `chore`: Maintenance tasks (dependency bumps, build scripts)

---

## 💻 Repository Structure

- `hulog-web/`: Vite + React + TypeScript visual hub and tabletop interactive simulator.
- `firmware/`: ESP32 embedded firmware (PlatformIO / ESP-IDF C++).
- `docs/`: In-depth engineering specifications, wiring pinout guides, BOM economics, and protocol contracts.

---

## 🧪 Testing Checklist Before Submitting PRs

- [ ] Web App runs clean with no TypeScript or lint errors (`npm run build`).
- [ ] Hardware pinouts match `firmware/include/config.h` and `docs/HARDWARE_WIRING.md`.
- [ ] No hardcoded Wi-Fi SSIDs, passwords, or production API tokens are committed.
- [ ] Any modifications to the BOM reflect exact real-world component specifications and pricing.
