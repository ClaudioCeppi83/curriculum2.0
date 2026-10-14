# MigraCode Curriculum Platform (Curriculum 2.0)
[![DPG Badge](https://img.shields.io/badge/Verified-DPG-3333AB?logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iMzEiIGhlaWdodD0iMzMiIHZpZXdCb3g9IjAgMCAzMSAzMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE0LjIwMDggMjEuMzY3OEwxMC4xNzM2IDE4LjAxMjRMMTEuNTIxOSAxNi40MDAzTDEzLjk5MjggMTguNDU5TDE5LjYyNjkgMTIuMjExMUwyMS4xOTA5IDEzLjYxNkwxNC4yMDA4IDIxLjM2NzhaTTI0LjYyNDEgOS4zNTEyN0wyNC44MDcxIDMuMDcyOTdMMTguODgxIDUuMTg2NjJMMTUuMzMxNCAtMi4zMzA4MmUtMDVMMTEuNzgyMSA1LjE4NjYyTDUuODU2MDEgMy4wNzI5N0w2LjAzOTA2IDkuMzUxMjdMMCAxMS4xMTc3TDMuODQ1MjEgMTYuMDg5NUwwIDIxLjA2MTJMNi4wMzkwNiAyMi44Mjc3TDUuODU2MDEgMjkuMTA2TDExLjc4MjEgMjYuOTkyM0wxNS4zMzE0IDMyLjE3OUwxOC44ODEgMjYuOTkyM0wyNC44MDcxIDI5LjEwNkwyNC42MjQxIDIyLjgyNzdMMzAuNjYzMSAyMS4wNjEyTDI2LjgxNzYgMTYuMDg5NUwzMC42NjMxIDExLjExNzdMMjQuNjI0MSA5LjM1MTI3WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==)](https://digitalpublicgoods.net/r/code-your-future)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success)](https://www.w3.org/WAI/WCAG21/quickref/)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)

> [!TIP]
> **Production Preview:** https://migracode-itp.netlify.app  
> **Original Curriculum:** https://curriculum.migracode.org  
> **Platform Documentation:** https://common.codeyourfuture.io

---

## 📖 Overview

This repository contains the **MigraCode Curriculum Platform (curriculum2.0)**, an open-source flipped-classroom learning platform designed for code schools. Built on top of **Hugo Extended**, **Pagefind Search**, and **GitHub GraphQL API**, it provides live syllabus navigation, interactive sprint backlogs, and modular learning blocks.

### Key Capabilities
- **Flipped Classroom Pedagogy:** Self-guided, learner-driven curriculum independent of teacher presence.
- **Live GitHub Integration:** Sprints query the GitHub GraphQL API at build time to dynamically generate clonable project backlog issues.
- **Accessible & Responsive:** W3C WCAG 2.1 AA compliant, mobile-first design with high contrast, semantic landmarks, and keyboard navigation.
- **Fast Client-Side Search:** Static multilingual full-text search powered by Pagefind (indexed in < 0.5s).
- **Dark/Light Mode:** Zero-FOUC theme switching respecting system `prefers-color-scheme` and user preference storage.

---

## 🏗️ Repository Architecture

The monorepo is organized using Hugo Modules and Go modules:

```text
├── common-theme/       # Shared Hugo theme: templates, SCSS (ITCSS), and Web Components
│   ├── assets/         # Scripts (Custom Elements), styles (ITCSS), images
│   └── layouts/        # Hugo partials, shortcodes, and _default templates
├── common-content/     # Headless curriculum blocks and shared markdown modules
├── org-cyf-itp/        # Active MigraCode/CYF Web Development Curriculum site
│   ├── content/        # Modules (onboarding, piscine, structuring-data, data-groups, etc.)
│   └── public/         # Static build output and Pagefind search indices
├── tooling/            # CLI utilities and architecture consistency enforcers
│   ├── create_module.sh # Automated scaffolder for new curriculum modules
│   └── go/             # Go-based consistency checkers (sprints, overrides, symlinks)
├── build.sh            # Production build runner (Hugo + Pagefind + GraphQL)
└── serve.sh            # Local development server script
```

---

## 🚀 Quick Start & Local Development

### Prerequisites
1. **Hugo Extended:** `v0.136.0+`
2. **Go:** `v1.22+`
3. **Node.js / npx:** `v18+` (for Pagefind)
4. **GitHub Personal Access Token:** Required to fetch live backlog issues via GraphQL.

### 1. Environment Setup
Create a `.env` file in the project root:
```bash
HUGO_CURRICULUM_GITHUB_BEARER_TOKEN="your_github_personal_access_token_here"
```

### 2. Build the Site
Run the automated build script:
```bash
./build.sh
```
This script executes:
1. Validates the existence of `.env` and exports the GitHub Bearer Token.
2. Compiles Hugo with live GraphQL backlog queries.
3. Indexes all HTML pages with `pagefind`.

### 3. Run the Development Server
```bash
./serve.sh
# Open http://localhost:3333 in your browser
```

---

## 🛠️ Tooling & Consistency Enforcers

To maintain strict pedagogical structure and prevent configuration drift across curriculum modules, this repository provides automated tooling:

### Module Scaffolding
Create a new standardized curriculum module with all required sprint and product directories:
```bash
./tooling/create_module.sh org-cyf-itp <new-module-name>
```

### Consistency Checks
Run the Go verification suite across the repository:
```bash
cd tooling/go
go run ./cmd/local-overrides-enforcer -root-dir ../..
go run ./cmd/site-consistency -root-dir ../..
go run ./cmd/sprint-consistency -root-dir ../..
```

---

## 🌿 Git & Upstream Synchronization

This repository follows a strict isolated upstream model:

- **`origin` (`ClaudioCeppi83/curriculum2.0`):** Personal development repository (read & write).
- **`upstream` (`Migracode-Barcelona/curriculum2.0`):** Upstream organization repository (**read-only**; push is blocked via Git config).

To sync new updates from the MigraCode organization without overwriting local enhancements:
```bash
git fetch upstream
git merge upstream/main
```

---

## 📄 License & Attribution

- Content: Licensed under [Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).
- Code: Licensed under the MIT License.
