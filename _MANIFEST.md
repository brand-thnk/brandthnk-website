# BrandThnk Website Manifest

## Repository Architecture

This folder contains **two git repositories** serving two websites:

| Repo | Remote | Deploys To | Branch |
|------|--------|-----------|--------|
| **Root** (`brandthnk-website.git`) | `brand-thnk/brandthnk-website` | **brandthnk.co** | main |
| **website/** (`brandthnk-automation.git`) | `brand-thnk/brandthnk-automation` | **brandthnkinsights.com** (portals) | main |

**Root is the source of truth for all content.** The `website/` subfolder is a separate repo used for automation/deployment of client portals to brandthnkinsights.com.

---

## 01_Canonical: Folder Map

### Client Portals (served from root at brandthnk.co/{client}-portal/)

| Portal | Path | Client | Status |
|--------|------|--------|--------|
| CheckAlt | `/checkalt-portal/` | CheckAlt (LoanPay Brand Strategy) | Active |
| HC3 | `/hc3-portal/` | HC3 | Active |
| Horicon Bank | `/horicon-bank-portal/` | Horicon Bank | Active |
| Digital Onboarding | `/do-portal/` | Digital Onboarding | Active |

### Main Site Pages (brandthnk.co)

| Page | Path | Purpose |
|------|------|---------|
| Homepage | `/index.html` | Main landing page |
| About | `/about.html` | About BrandThnk |
| Offers | `/offers/` | Service offerings (workshop, breakthrough, advisory, training) |
| Library | `/library/` | Published articles and frameworks |
| Podcast | `/podcast/` | Podcast content |
| Newsletter | `/newsletter/` | Newsletter assets |
| Book | `/book/` | Book-related content |

### BrandThnk Insights (brandthnkinsights.com)

| Section | Path | Purpose |
|---------|------|---------|
| Insights Platform | `/insights/` | AI-powered banking research platform |
| Persona Library | `/insights/complete-persona-library.js` | Fintech C-suite persona data |
| Research Reports | `/insights/reports.html` | Generated research reports |

### Infrastructure

| File | Purpose |
|------|---------|
| `/netlify.toml` | Netlify build config (serverless functions) |
| `/netlify/` | Netlify serverless functions |
| `/contract-webhook.gs` | Google Sheets webhook for contracts |
| `/contracts/` | Client contract pages |
| `/assets/` | Shared site assets (CSS, images, fonts) |

### Archival (do not load unless explicitly asked)

| Path | Contents |
|------|----------|
| `/archived/` | Legacy newsletter webhook |
| `/insights/archived/` | Legacy persona libraries and index pages |
| `/therapy/` | Internal session tools |

---

## 02_Domain: Client Portal Operations

### How to Create a New Client Portal

1. Create folder at root: `/{client-name}-portal/`
2. Create `index.html` as the portal landing page (use existing portal as template)
3. Add deliverable pages as separate HTML files in the same folder
4. Add any assets in `/{client-name}-portal/assets/` if needed
5. Update this manifest with the new portal entry
6. If the portal should also deploy to brandthnkinsights.com, copy the folder to `website/{client-name}-portal/` and commit to the automation repo

### How to Update an Existing Client Portal

1. **Always edit in the ROOT portal folder first** (e.g., `/checkalt-portal/`)
2. Root is the source of truth. Never edit only in `website/`
3. After updating root, sync changes to `website/{client-name}-portal/` if that portal is also deployed there
4. Each repo requires its own git commit

### Portal File Naming Conventions

- Portal folder: `{client-name}-portal/`
- Landing page: `index.html`
- Deliverables: descriptive names like `messaging-framework.html`, `competitive-intelligence.html`
- Assets subfolder: `assets/` (for PDFs, images)
- Downloads subfolder: `downloads/` (for downloadable files)

### How to Update the BrandThnk Website (brandthnk.co)

1. All changes go in the root repo (`brandthnk-website.git`)
2. Edit HTML files directly (this is a static site)
3. Main pages: `index.html`, `about.html`
4. Library articles: add to `/library/`
5. Commit to `main` branch, Netlify auto-deploys

### How to Update BrandThnk Insights (brandthnkinsights.com)

1. The insights research platform lives in `/insights/` within the root repo
2. Portal deployments to insights go in the `website/` subfolder (separate `brandthnk-automation` repo)
3. Commit changes in `website/` to the automation repo's `main` branch
4. Netlify auto-deploys from that repo

---

## 03_Archival: Version History

- `website/` subfolder contains a parallel copy of portals for automation deployment. Root versions are canonical.
- Legacy/superseded files should be moved to `/archived/` or the relevant `archived/` subfolder.
- Do not create files at root level with client prefixes (e.g., `do-website-audit-march-2026.html`). All client work belongs inside its portal folder.

---

## Rules for AI Agents (Claude Code, Cowork)

1. **Never create portal files outside the portal folder.** All client deliverables go in `/{client}-portal/`.
2. **Never create new top-level folders** like `website_2/`, `projects/`, or `client-portals/`. Portals live at root.
3. **Root is source of truth.** If `website/` has a portal, it is a deployment copy, not the primary.
4. **Always update this manifest** when adding a new portal or major section.
5. **Two repos = two commits.** Changes that affect both brandthnk.co and brandthnkinsights.com require separate commits to each repo.
