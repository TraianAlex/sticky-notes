# React sticky notes

- npm install
- npm run dev

This app is a Vite + React single-page UI with a small cards module under `src/cards`. The root `App` component renders `AppCards`, which owns board state, drag/resize interactions, and connects the UI to persisted state in `localStorage` via `useLocalStorageState`. That custom hook handles serialization and optional cross-tab syncing, keeping the component tree focused on UI logic.

UI elements are composed into focused components (`Card`, `AddButton`, `AddModal`, `TrashZone`) and lifted state flows down as props. `AppCards` coordinates behavior like drag state, sizing constraints, and deletion, while `Card` is memoized to reduce re-renders and `AddModal` is code-split with `React.lazy` for faster initial load. Styles are primarily utility classes, with minimal global CSS in `src/App.css` and `src/index.css`.

Feaures:
- Create a new note of the specified size at the specified position (in config DEFAULT_SIZE)
- Change note size by dragging
- Move a note by dragging
- Remove a note by dragging it over a predefined "trash" zone
- Entering note text at creation time
- Saving notes to local storage (restoring them on page load)
- Cross-tab syncronization

Todo:
- Edit note text
- Saving notes to REST API

---
- deployed https://styckynotes.netlify.app/
