# Clinisys

Application de gestion de clinique :

| Partie       | Techno                      | Port | Dossier                  |
| ------------ | --------------------------- | ---- | ------------------------ |
| Frontend     | React 19 + Vite             | 5173 | `menu-app/`              |
| Backend      | Spring Boot 4 (Java 17+)    | 8080 | `clinicsystem/clinicsystem/` |
| Base         | MySQL (XAMPP / WAMP)        | 3306 | base `clinicsystem`      |
| Service video| Python 3.11+ (Flask, Pillow)| 5000 | `video_service.py`       |

## Demarrage rapide (Windows)

1. **Demarrer MySQL** (XAMPP / WAMP / service MySQL).
2. **Double-cliquer sur `start.cmd`** (ou lancer `npm start`).

Le script :

- detecte automatiquement un JDK 17 ou plus recent (obligatoire pour le backend) ;
- demarre le backend dans une fenetre dediee (`http://localhost:8080`) ;
- demarre le frontend dans une fenetre dediee (`http://localhost:5173`) ;
- demarre le service video Python dans une fenetre dediee (`http://localhost:5000`) ;
- ouvre le navigateur.

Pour tout arreter : **`stop.cmd`** (ou `npm run stop`).

### Scripts disponibles

| Commande                    | Effet                                     |
| --------------------------- | ----------------------------------------- |
| `start.cmd`                 | backend + frontend + video + navigateur   |
| `start-backend.cmd`         | backend uniquement                        |
| `start-frontend.cmd`        | frontend uniquement                       |
| `start-video.cmd`           | service de generation de video uniquement |
| `stop.cmd`                  | arrete les ports 8080, 5173 et 5000        |
| `backup-db.cmd`             | sauvegarde la base dans `backups/`        |
| `npm run dev`               | identique a `start.cmd`                   |
| `npm run build`             | build de production du frontend           |

## Vos donnees

Tout est stocke dans **MySQL** (base `clinicsystem`), pas dans le navigateur :

| Donnee    | Table MySQL  |
| --------- | ------------ |
| Modules   | `modules`    |
| Menus     | `menus`      |
| Captures  | `captures`   |
| Employes  | `employees`  |

Une modification n'est enregistree que si le backend repond. Depuis cette
version, tout echec est affiche dans un bandeau rouge en haut de l'ecran
(avant, l'erreur restait invisible dans la console du navigateur).

Sauvegarde manuelle :

```
backup-db.cmd
```

Le fichier `.sql` est cree dans `backups/` (a sauvegarder ailleurs, par
exemple sur un cloud). Restauration :

```
mysql -u root -p clinicsystem < backups\clinicsystem-AAAAMMJJ-HHMMSS.sql
```

## Tests d'API (Postman)

Le dossier `postman/` contient une collection de tests de l'API REST
(authentification, modules, menus, captures, employes) avec assertions
automatiques et environnement `Clinisys Local`.

1. Importer les deux fichiers JSON dans Postman.
2. Demarrer le backend (`start-backend.cmd`).
3. Lancer la collection dans l'ordre indique (ou via Collection Runner).

Details : `postman/README.md`.

## Compte de test

| Email                | Mot de passe | Role  |
| -------------------- | ------------ | ----- |
| `zouba123@gmail.com` | `12345`      | admin |

Le compte est cree automatiquement au premier demarrage du backend
(`AdminSeeder`).

## Problemes courants

### « Serveur injoignable » / page de connexion qui refuse tout

Le backend n'est pas demarre. Lancez `start-backend.cmd` et verifiez que
`http://localhost:8080/api/menus` repond.

### « J'ai ajoute un employe / renomme un module et c'est perdu »

Ces modifications n'ont pas atteint la base : le backend etait arrete ou
n'avait pas demarre (voir Java ci-dessous). L'interface affichait l'erreur
uniquement dans la console du navigateur. Elle s'affiche maintenant dans
un bandeau rouge. Verifiez l'etat reel des donnees dans MySQL :

```
SELECT id, name FROM modules;
SELECT COUNT(*) FROM captures;
SELECT id, email, role FROM employees;
```

### Le backend ne demarre pas : `UnsupportedClassVersionError`

Le `java` du PATH est Java 8. Le backend exige Java 17+ :

- `start.cmd` selectionne automatiquement le bon JDK ;
- ou installez un JDK recent : `winget install EclipseAdoptium.Temurin.21.JDK`.

### « Generer la video » ne fait rien / affiche une erreur

Le bouton appelle un service Python separe sur le port 5000. Il doit tourner :

```
start-video.cmd
```

Le script choisit un Python qui possede Flask + Pillow (le Python 3.15 alpha
du PATH a un Pillow incompatible, il est ignore au profit de 3.11/3.13).
Si aucun Python correct n'est trouve, il cree un `.venv` et installe les
paquets. Verifiez ensuite que `http://localhost:5000` repond.

### Le backend demarre puis echoue sur la base de donnees

L'URL et l'utilisateur sont dans
`clinicsystem/clinicsystem/src/main/resources/application.properties` :

```
jdbc:mysql://localhost:3306/clinicsystem
utilisateur : root
```

Le **mot de passe** n'est pas versionne : il se trouve dans
`clinicsystem/clinicsystem/application-local.properties` (ignore par git).
Si ce fichier n'existe pas (apres un clone), creez-le :

```
spring.datasource.password=votre_mot_de_passe_mysql
```

### `npm run dev` ne fait rien a la racine

La racine n'avait pas de script `dev` : c'est corrige, `npm run dev`
lance desormais `start.ps1`. Le serveur Vite seul se lance avec
`npm run frontend` ou depuis `menu-app/`.

## Docker (optionnel)

`docker-compose.yml` fournit MySQL (3307), le backend (8080), le frontend
(80) et le service Python (5000). Docker n'est pas necessaire pour le
developpement local decrit ci-dessus.
