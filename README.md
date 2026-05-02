# Internet Toys

University project for the **TUM Web Programming** course — covers **Lab 6 (Front-end)** and **Lab 7 (Back-end)**.

A playful online toy catalog where users can browse, filter and "like" (wishlist) toys, add them to a cart, and check out. Admins can manage the catalog (CRUD). The catalog data is served by our own JWT-protected REST API (Lab 7).

## Status

This is the **scaffolding commit**. Subsequent commits incrementally add styling, components, pages, state, the backend API and the deploy pipeline. Each commit is small enough to `git checkout` and demo the app at that stage.

## Stack (target)

- **Front-end**: Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Back-end**: Node.js + Express + TypeScript + JSON file store + JWT + Swagger UI
- **State**: in-memory React contexts; cart and wishlist persisted to `localStorage`; product cache in `IndexedDB`
- **i18n**: i18next (RO / RU / EN)
- **Hosting**: GitHub Pages (front-end), Render / Railway / Fly.io (back-end)

## Local dev

```bash
npm install
npm run dev          # http://localhost:8080
```
