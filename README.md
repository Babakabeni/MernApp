# Task Manager

Application MERN de gestion de tâches, composée de trois conteneurs Docker : React/Vite, Node.js/Express et MongoDB.

## Démarrage

Depuis la racine du projet :

```bash
docker compose up --build
```

Accès :

- Frontend : http://localhost:3000
- API : http://localhost:5000/api/tasks
- Santé API : http://localhost:5000/api/health
- MongoDB : localhost:27017

## Structure

```text
.
├── backend/
│   ├── src/config/db.js
│   ├── src/controllers/taskController.js
│   ├── src/middleware/errorMiddleware.js
│   ├── src/models/Task.js
│   ├── src/routes/taskRoutes.js
│   ├── src/app.js
│   └── src/server.js
├── frontend/
│   ├── src/App.jsx
│   ├── src/main.jsx
│   ├── src/styles.css
│   ├── vite.config.js
│   └── Dockerfile
└── docker-compose.yml
```

## API

| Méthode | Route | Action |
| --- | --- | --- |
| GET | `/api/tasks` | Lister les tâches |
| GET | `/api/tasks/:id` | Lire une tâche |
| POST | `/api/tasks` | Créer une tâche |
| PUT | `/api/tasks/:id` | Modifier une tâche |
| DELETE | `/api/tasks/:id` | Supprimer une tâche |

Les statuts acceptés sont `À faire`, `En cours` et `Terminée`. Le volume Docker `mongodb_data` conserve les données MongoDB entre les redémarrages.

## Développement local sans Docker

Lancer MongoDB localement, puis dans deux terminaux :

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```
