# 🏥 Clinisys

A clinic management app built with React, Spring Boot and MySQL. Clinisys lets a clinic organise its documentation as **modules → menus → captures**, generate a walkthrough video for each menu, manage employees, and ask a chatbot questions about the screenshots it stores.

I built it as a full-stack learning project: a real REST API, a real database, and a UI that talks to both.

## 🍿 Technologies

- React 19
- Vite
- Spring Boot 4 (Java 17+)
- MySQL
- Python 3.11+ (Flask + Pillow) — video generation service
- Postman
- Docker
- CSS

## ✨ Features

Here's what you can do with Clinisys:

- **Log in**: authenticate with an email and password. Admins get access to employee management; the session is kept in `localStorage`.
- **Organise modules**: create, rename and delete modules. Each module holds its own set of menus.
- **Build menus and submenus**: menus can be nested under a parent menu, renamed, reordered and deleted.
- **Store captures**: upload screenshots into a menu, view them in a grid, edit the title/description, replace the image, or delete several at once with checkboxes.
- **Reorder captures**: drag and drop to change the order in which screenshots appear.
- **Generate a video**: a Python service turns the captures of a menu into an MP4 walkthrough, which can be validated or removed later.
- **Manage employees**: add, edit and delete staff accounts from the Employees page (admin only).
- **Ask the chatbot**: the assistant searches the captures and modules the current user is allowed to see, then answers with Groq.
- **See every error**: any failed API call shows a red banner instead of failing silently in the browser console.

## 🧑‍🍳 The Process

I started with the database, because everything else depends on its shape. A module contains menus, a menu contains captures, and a menu can contain another menu — that self-reference was the first thing I had to model properly in JPA.

Next came the backend: a Spring Boot REST API with controllers, services and repositories for modules, menus, captures and employees, plus a login endpoint. I tested each endpoint in Postman before touching the UI, which saved me from debugging two layers at once.

Then the frontend. I built the screens in the order a user meets them: login → module list → sidebar of menus → grid of captures. Each screen is driven by API calls rather than local state, so what you see is what is actually stored in MySQL.

After the CRUD worked, I added the parts that make it feel finished: drag-and-drop reordering, multi-select deletion, and image upload with file storage on the backend.

Finally the two features that reach outside the main app — a separate Python service that renders captures into an MP4 with Pillow, and a chatbot that answers questions using the stored captures as context.

One thing I changed late: errors used to be logged only in the browser console, so a failed save looked like a successful one. Now every API call routes through a notification layer that shows the real error on screen.

## 📚 What I Learned

- **Modelling a hierarchy in JPA**: a menu pointing at its parent menu taught me how self-referencing entities and recursive JSON serialisation actually behave.
- **REST API design**: separating controllers, services and repositories made the code longer at first, but every change afterwards stayed small and local.
- **React state across screens**: keeping the selected module, menu and captures in sync showed me why a single source of truth matters more than passing props everywhere.
- **Silent failures are worse than errors**: the red error banner was the single biggest improvement to the app's usability.
- **Environment variables**: secrets belong in `.env` / local config files, never in source code.
- **Testing with Postman**: running a collection after each change caught broken endpoints before the UI did.
- **Windows startup scripts**: making one command start three services (Java, Node, Python) meant handling ports, JDK detection and missing dependencies.

## 💡 How can it be improved?

- Add pagination and search to the capture grid.
- Replace the localStorage session with JWT tokens and a real session expiry.
- Add a proper image editor (crop, annotate) instead of replace-only.
- Write automated tests for the backend (JUnit) and the frontend (Vitest).
- Make the layout responsive — it is currently desktop-first.
- Add dark mode.
- Move the database password and API keys into a secrets manager for deployment.
- Add a "restore" action for deleted modules, menus and captures.

## 🏃 Running the Project

### Requirements

| Part | Technology | Port | Folder |
| --- | --- | --- | --- |
| Frontend | React 19 + Vite | 5173 | `menu-app/` |
| Backend | Spring Boot 4 (Java 17+) | 8080 | `clinicsystem/clinicsystem/` |
| Database | MySQL (XAMPP / WAMP) | 3306 | database `clinicsystem` |
| Video service | Python 3.11+ (Flask, Pillow) | 5000 | `video_service.py` |

### Steps (Windows)

1. Clone the repository to your local machine.
2. Start MySQL (XAMPP, WAMP, or the MySQL service).
3. Create the local config files (see **Configuration** below).
4. Run `start.cmd` (or `npm start`) in the project directory. It finds a JDK 17+, starts the backend, the frontend and the video service in separate windows, then opens the browser.
5. Open http://localhost:5173 if the browser did not open by itself.

To stop everything: `stop.cmd` (or `npm run stop`).

### Scripts

| Command | Effect |
| --- | --- |
| `start.cmd` | backend + frontend + video service + browser |
| `start-backend.cmd` | backend only |
| `start-frontend.cmd` | frontend only |
| `start-video.cmd` | video service only |
| `stop.cmd` | stops ports 8080, 5173 and 5000 |
| `backup-db.cmd` | dumps the database into `backups/` |
| `npm run build` | production build of the frontend |

### Configuration

Nothing secret is committed. Two files are created locally and ignored by git:

**`clinicsystem/clinicsystem/application-local.properties`** — your MySQL password:

```properties
spring.datasource.password=your_mysql_password
```

**`menu-app/.env`** — your Groq API key for the chatbot (copy `menu-app/.env.example`):

```
VITE_GROQ_API_KEY=your_key_here
```

The database URL and user (`root`) stay in `application.properties`.

### Test account

| Email | Password | Role |
| --- | --- | --- |
| `zouba123@gmail.com` | `12345` | admin |

Created automatically on the backend's first start (`AdminSeeder`).

### API tests (Postman)

The `postman/` folder holds a REST API collection (auth, modules, menus, captures, employees) with automatic assertions and a `Clinisys Local` environment.

1. Import both JSON files into Postman.
2. Start the backend (`start-backend.cmd`).
3. Run the collection in the listed order, or with the Collection Runner.

Details: `postman/README.md`.

### Docker (optional)

`docker-compose.yml` runs MySQL (3307), the backend (8080), the frontend (80) and the Python service (5000). Docker is not required for local development.

## 🐛 Troubleshooting

**"Server unreachable" / login refuses everything** — the backend is not running. Start `start-backend.cmd` and check that http://localhost:8080/api/menus responds.

**A change disappeared after refresh** — it never reached MySQL; the backend was stopped. The red banner now tells you when that happens.

**`UnsupportedClassVersionError`** — your `java` on the PATH is Java 8. `start.cmd` selects a correct JDK automatically, or install: `winget install EclipseAdoptium.Temurin.21.JDK`.

**"Generate video" does nothing** — the Python service on port 5000 is not running. Start it with `start-video.cmd`; the script finds a Python that has Flask and Pillow, or creates a `.venv`.

**The chatbot answers with an error** — `menu-app/.env` is missing or `VITE_GROQ_API_KEY` is empty. Vite only reads `.env` at startup, so restart the dev server after editing it.

## 🎥 Video

<!-- Add a demo GIF or MP4 here, e.g. a screen recording of the module → menu → capture flow. -->
