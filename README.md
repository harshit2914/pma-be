# Project Management Backend

Express + MongoDB backend for Project Management App.

Environment variables (.env):
- PORT
- MONGO_URI
- JWT_SECRET

Install & Run:

```bash
cd backend
npm install
npm run dev   # requires nodemon, or npm start
```

Deploy to Railway:
- Push repo to GitHub
- Create Railway project, link repo
- Set `MONGO_URI` and `JWT_SECRET` in Railway environment variables
- Railway will run `npm start` by default
