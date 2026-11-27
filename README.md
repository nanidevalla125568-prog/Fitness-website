# FitFuel — BMI & Personalized Meal Planner (AWT Mini Project)

FitFuel is a responsive full-stack wellness planning demo. Users create an account or log in, enter their height, weight, age, activity level, dietary preference and target weight, and receive BMI and rough calorie estimates plus meal ideas.

## Stack
- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Database: MongoDB / MongoDB Atlas (Mongoose)
- Authentication: bcrypt password hashing and JWT

## Run locally
1. Install Node.js LTS.
2. Extract the project and open its root directory in VS Code.
3. Run `npm run setup`.
4. Copy `server/.env.example` to `server/.env` and edit settings (see below).
5. Run `npm run dev` from the project root.
6. Visit http://localhost:5173. API health: http://localhost:4000/api/health.

Example `server/.env`:
```
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/fitfuel?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## Features
- Account creation and login; passwords are hashed with bcrypt (never stored as plaintext).
- BMI calculation and general BMI category.
- Inputs for age, height, current/target weight, activity and vegetarian/non-vegetarian preference.
- Rough daily maintenance and goal-adjusted calorie estimate.
- Simple meal ideas for both dietary options.
- Responsive overview and navigation.

## Important
BMI and calorie values are approximations for educational demonstration, not medical advice or individualized nutrition prescriptions. The energy calculation uses a simplified equation that does not account for sex, body composition, clinical factors or other variables. Meal suggestions are examples, not a complete nutrition plan. The app intentionally does not claim to calculate exercise calories precisely. Avoid extreme restriction; consult a qualified professional for personal advice.

See `DEPLOYMENT.md` for Render and Vercel instructions.
