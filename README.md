# UMKM Operational Management

Lightweight POS & Inventory system for UMKM.

**Stack:** Google Apps Script (API) + HTMX + Tailwind CSS + Google Sheets

## Quick Start
1. Create Google Sheet with 5 tabs (`Users`, `Items`, `Transactions`, `Transaction_Details`, `Stock_Logs`)
2. Copy headers from `docs/schema.md`, add dummy admin user
3. Paste `dist/Code.gs` into Apps Script → Deploy as Web App
4. Update `GAS_API_URL` in `static/js/config.js`
5. Serve frontend with any static host (Vercel/Netlify/GitHub Pages)

See `docs/deploy.md` for full guide.

## Project Structure
```
├── dist/Code.gs           # Apps Script backend
├── docs/                  # Schema, deploy guide, test plan
├── static/js/             # api.js, auth.js, cart.js
├── partials/              # navbar.html, sidebar.html
├── index.html             # Dashboard
├── login.html
├── pos.html               # Point of Sale
├── items.html             # Items management
├── stock.html             # Stock management
├── transactions.html      # Transaction history
└── task/todo.md           # Task tracking
```