# Clinisys — Frontend

React 19 + Vite frontend for [Clinisys](../README.md), a clinic management app.
It talks to the Spring Boot backend on port 8080 and the Python video service on
port 5000.

## Run

From the repository root (recommended, starts everything):

```powershell
start.cmd
```

Frontend alone:

```powershell
npm install
npm run dev
```

The app opens on http://localhost:5173.

## Environment

The chatbot uses Groq, and its key is not committed. Copy `.env.example` to
`.env` and fill it in:

```
VITE_GROQ_API_KEY=your_key_here
```

Vite only reads `.env` at startup, so restart the dev server after editing it.

## Structure

```
src/
├── api/          # one module per backend resource (captures, menus, modules, employees)
├── components/   # sidebar, capture grid/editor, modals, chatbot, notifications
├── pages/        # Login, Home (modules), Employees
├── App.jsx       # module → menu → capture navigation and state
└── main.jsx
```

## Build

```powershell
npm run build
```

Output goes to `dist/`.

## Related docs

- Root [README](../README.md) — features, setup, troubleshooting
- [Postman tests](../postman/README.md) — API test collection
