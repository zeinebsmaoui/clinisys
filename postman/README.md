# Tests Postman - API Clinisys

Collection de tests de l'API REST du backend Spring Boot.

| Fichier | Role |
| ------- | ---- |
| `Clinisys-API.postman_collection.json` | 4 dossiers de tests (modules, menus, captures, employes) + dossier manuel |
| `Clinisys-Local.postman_environment.json` | `baseUrl`, `email`, `password` |

## 1. Importer

1. Ouvrir Postman.
2. **Import** (ou `Ctrl+O`) puis glisser les **deux** fichiers JSON.
3. En haut a droite, choisir l'environnement **Clinisys Local**.

## 2. Demarrer le backend

```powershell
start-backend.cmd
```

Verifier : `http://localhost:8080/api/modules` repond.

## 3. Executer

Toujours dans l'ordre, car les identifiants sont transmis entre les dossiers :

1. **1. Authentification** -> `Login admin` (sauvegarde `employeeId`).
2. **2. Modules** -> liste (sauvegarde `moduleId`), creation, renommage, suppression.
3. **3. Menus** -> liste (sauvegarde `menuId`), creation, renommage, suppression.
4. **4. Captures** -> liste, televersement, modification, reordonnancement, suppression.
5. **5. Employes** -> liste, creation, modification, suppression.

Le plus simple : **Collection Runner** -> selectionner la collection -> **Run**.
Les dossiers 2 a 5 creent puis suppriment leurs propres donnees : la base
retrouve son etat initial apres une execution complete.

Deux requetes demandent de **choisir un fichier image** avant l'envoi
(`Televerser une capture`, `Remplacer l'image`) : dans l'onglet *Body*,
champ `file`, cliquer sur *Select File*.

Le dossier **Avance (manuel)** contient `Enregistrer une video` : il ecrase la
video du menu `menuId` par un GIF 1x1. Ne pas l'executer sur un menu reel.

## 4. Ce que les tests verifient

- Authentification : 200 avec identifiants valides, 401 sinon, mot de passe absent de la reponse.
- Modules / menus / employes : creation, lecture, mise a jour, suppression + coherence des ids et des relations (menu rattache au bon module).
- Captures : upload multipart, metadonnees, reordonnancement, remplacement d'image, suppression.
- Codes HTTP et forme des reponses (tableaux, ids numeriques, champs non vides).

## 5. Ligne pour le CV

> Tests d'API avec Postman : collection de 21 requetes, environnement
> parametre, assertions automatiques (codes HTTP, schema, relations) et
> scenarios de non-regression executes via Collection Runner.
