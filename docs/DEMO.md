# Demo Script

A 60-second walkthrough of Clinisys, used for the recording in the README.

## Before recording

1. Start MySQL, then run `start.cmd`.
2. Confirm the backend answers: http://localhost:8080/api/modules
3. Confirm the frontend opens: http://localhost:5173
4. Close unrelated tabs and windows.
5. Pick one module that already has menus and captures, so nothing looks empty.

## Shot list

| # | Action | What it should show |
| - | ------ | ------------------- |
| 1 | Open http://localhost:5173 | Login screen |
| 2 | Log in as `zouba123@gmail.com` / `12345` | Module list with the sidebar |
| 3 | Click a module | Its menus appear |
| 4 | Click a menu | Grid of captures loads from MySQL |
| 5 | Drag a capture to a new position | Order changes and persists |
| 6 | Open a capture | Editor with annotations |
| 7 | Ask the chatbot a question | Answer built from the stored captures |
| 8 | Click "Générer la vidéo" | Video generated from the captures |
| 9 | Log out | Back to the login screen |

## Recording tips

- Windows Game Bar: `Win + G`, then record. Keep it under 60 seconds.
- Move the mouse slowly and pause on each result — a fast recording is unreadable.
- If the file exceeds 10 MB, convert it to GIF or upload it to YouTube and embed the link.

## After recording

Drag the file into the `## 🎥 Video` section of `README.md` on GitHub, or reference it
from `docs/` if you prefer to keep the binary out of the README editor.
