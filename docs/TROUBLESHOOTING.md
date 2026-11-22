# Troubleshooting

Solutions to the problems that come up most often when running Clinisys
locally on Windows.

## "Server unreachable" — the login page rejects everything

The backend is not running. Start it with:

```powershell
start-backend.cmd
```

Then confirm that http://localhost:8080/api/menus responds.

## A change disappeared after refreshing

It never reached MySQL — the backend was stopped when you saved. Since the
error banner was added, this is reported on screen instead of only in the
browser console. Check the real state of the data:

```sql
SELECT id, name FROM modules;
SELECT COUNT(*) FROM captures;
SELECT id, email, role FROM employees;
```

## `UnsupportedClassVersionError` when starting the backend

The `java` on your PATH is Java 8; the backend requires Java 17 or newer.

- `start.cmd` selects a compatible JDK automatically, or
- install one: `winget install EclipseAdoptium.Temurin.21.JDK`

## "Generate video" does nothing

The Python service on port 5000 is not running:

```powershell
start-video.cmd
```

The script picks a Python installation that has Flask and Pillow, or creates a
`.venv` and installs the packages. Then check that http://localhost:5000
responds.

## The chatbot returns an error

`menu-app/.env` is missing or `VITE_GROQ_API_KEY` is empty. Copy
`menu-app/.env.example` to `menu-app/.env` and add a key from
https://console.groq.com/keys. Vite reads `.env` only at startup, so restart
the dev server after editing it.

## The backend starts, then fails on the database

Check `clinicsystem/clinicsystem/src/main/resources/application.properties`
and `clinicsystem/clinicsystem/application-local.properties`: the URL, user
and password must match your local MySQL instance. The password belongs in the
second file, which is not committed.
