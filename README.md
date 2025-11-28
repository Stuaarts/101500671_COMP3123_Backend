## Backend – Employee Manager API (Lucas)

This is my Node.js/Express backend for COMP 3123 Assignment 2. It exposes REST APIs for auth and employee CRUD, connects to MongoDB with Mongoose, and supports search and avatar uploads.

### How I run it locally
- From the `backend` folder:
  - `npm install`
  - Create `.env` based on `.env.example`:
    - `PORT=5000` (or leave default)
    - `MONGO_URI=mongodb://localhost:27017/comp3123_assignment` (or my Atlas URL)
    - `JWT_SECRET=` some strong secret
    - `CLIENT_URL=http://localhost:3000` (where the React app runs)
  - `npm run dev` (nodemon) or `npm start`
- API base URL: `http://localhost:5000/api`

### Main endpoints
- Auth
  - `POST /api/auth/signup` – create user (name, email, password)
  - `POST /api/auth/login` – login, returns JWT token
- Health
  - `GET /api/health` – basic health check
- Employees (JWT `Authorization: Bearer <token>` required)
  - `GET /api/employees` – list all
  - `GET /api/employees/:id` – get one
  - `POST /api/employees` – create (supports `avatar` file upload)
  - `PUT /api/employees/:id` – update (also supports `avatar`)
  - `DELETE /api/employees/:id` – delete
  - `GET /api/employees/search?department=&position=` – search by department/position

Uploads are saved under `backend/uploads` and served from `/uploads/...` by the server.

### Docker / Docker Compose
When used from the main assignment folder (where `docker-compose.yml` is):
- `docker-compose up --build`
- This starts:
  - Backend container on `http://localhost:5000/api`
  - Frontend container on `http://localhost:3000`
  - MongoDB + mongo-express on `http://localhost:8081`

### For assignment submission
- `node_modules` is removed before zipping this backend project.
- GitHub repo includes:
  - This README
  - `src/` with routes, models, middleware, config
  - `.env.example` so env variables are clear
  - `Dockerfile` for container builds
