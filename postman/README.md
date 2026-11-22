# Postman Tests — Clinisys API

Test collection for the Spring Boot backend's REST API.

| File | Purpose |
| ---- | ------- |
| `Clinisys-API.postman_collection.json` | 4 test folders (modules, menus, captures, employees) + a manual folder |
| `Clinisys-Local.postman_environment.json` | `baseUrl`, `email`, `password` |

## 1. Import

1. Open Postman.
2. **Import** (or `Ctrl+O`) and drag in **both** JSON files.
3. Top right, select the **Clinisys Local** environment.

## 2. Start the backend

```powershell
start-backend.cmd
```

Check that `http://localhost:8080/api/modules` responds.

## 3. Run

Always in order, because IDs are passed between folders:

1. **1. Authentication** → `Login admin` (saves `employeeId`).
2. **2. Modules** → list (saves `moduleId`), create, rename, delete.
3. **3. Menus** → list (saves `menuId`), create, rename, delete.
4. **4. Captures** → list, upload, update, reorder, delete.
5. **5. Employees** → list, create, update, delete.

The easiest way: **Collection Runner** → select the collection → **Run**.
Folders 2 to 5 create and then delete their own data, so the database returns
to its initial state after a full run.

Two requests require you to **pick an image file** before sending
(`Upload a capture`, `Replace the image`): in the *Body* tab, field `file`,
click *Select File*.

The **Advanced (manual)** folder contains `Save a video`: it overwrites the
`menuId` menu's video with a 1x1 GIF. Do not run it against a real menu.

## 4. What the tests check

- Authentication: 200 with valid credentials, 401 otherwise, password absent from the response.
- Modules / menus / employees: create, read, update, delete + id and relationship consistency (menu attached to the right module).
- Captures: multipart upload, metadata, reordering, image replacement, deletion.
- HTTP status codes and response shapes (arrays, numeric ids, non-empty fields).

## 5. Résumé line

> API testing with Postman: a 21-request collection, a parameterised
> environment, automatic assertions (status codes, schema, relations) and
> non-regression scenarios run through the Collection Runner.
