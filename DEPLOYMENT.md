# Deploy FitFuel (Render + Vercel + MongoDB Atlas)

## 1. MongoDB Atlas
- Create a free Atlas cluster and database user.
- In Network Access, allow access from Render (for a student demo, you may temporarily allow `0.0.0.0/0`; protect the database with a strong password).
- Copy the connection URI and replace placeholders. URL-encode special characters in the password.

## 2. Backend on Render
- Push this project to GitHub.
- Create a Render Web Service from the repository.
- Root directory: `server`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Environment variables: `MONGO_URI` (Atlas URI), `JWT_SECRET` (long random secret), `CLIENT_ORIGIN` (Vercel site URL once created), `NODE_ENV=production`.
- Deploy and test `https://YOUR-RENDER-SERVICE.onrender.com/api/health`.

## 3. Frontend on Vercel
- Import the same GitHub repository.
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Add environment variable `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api`.
- Deploy.

## 4. Finish CORS setup
- Update Render's `CLIENT_ORIGIN` with your actual Vercel URL (no trailing slash), then redeploy the backend.
- Open the Vercel app and test create-account, login, BMI inputs and meal suggestions.

## Local test
From root: `npm run setup`, create `server/.env` based on `.env.example`, then `npm run dev`. Frontend http://localhost:5173 and API health http://localhost:4000/api/health.

Never commit `.env` files, Atlas credentials or JWT secrets. This student demo is not production-hardened; it lacks rate limiting, email verification, password reset, secure cookie sessions and clinical validation of wellness calculations.
