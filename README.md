# Coding-Journal


The Coding Journal App is a full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js). It allows users to register, log in, and manage a personal collection of coding problems they’ve solved or want to track. Each user can **create, read, update, delete (CRUD)** their own problems securely using **JWT authentication**.

---

## 🚀 Live Demo

- 🌐 Frontend: [https://coding-journal-vv.vercel.app](https://coding-journal-vv.vercel.app)
- 🌐 Backend: [https://coding-journal-hqbn.onrender.com](https://coding-journal-hqbn.onrender.com)

---

## 📌 Features

- 🔐 **Multi-user Authentication** with JWT and bcrypt
- 🧠 **CRUD Operations** for coding problems
- 🔍 **Search** and **filter** by difficulty
- 🧩 **Edit/Delete** problems individually
- 🧭 **Responsive UI** with React Bootstrap
- 🔁 **Logout on token expiry** (401 auto handling)
- 📚 MongoDB integration with Mongoose
- 🎯 Private routes for each user's data only

---

## 🛠️ Tech Stack

| Frontend      | Backend     | Database | Auth |
| ------------- | ----------- | -------- | ---- |
| React.js      | Node.js     | MongoDB  | JWT, bcrypt |
| React Router  | Express.js  | Mongoose |      |
| Bootstrap     |             |          |      |

---

## 📂 Project Structure

#### Frontend
/client
/src
/pages
/components
/context (AuthContext.js)
App.js
index.js

#### Backend
/server
/models (User.js, Problem.js)
/routes (userRoutes.js, problemRoutes.js)
/middleware (authMiddleware.js)
server.js

---

## ⚙️ Environment Variables

Create a `.env` file in the backend root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
```

✅ Note: Make sure to add these on Render under Environment > Environment Variables as .env is ignored in Git.

---

## 🧪 API Endpoints

### User Routes

|        Route        | Method |     Description     |
| ------------------- | ------ | ------------------- |
| /api/users/register |  POST  |  Register new user  | 
|  /api/users/login	  |  POST	 | Login and get token |


### Problem Routes (protected)

|        Route      | Method  |        Description      |
| ----------------- | ------- | ----------------------- |
|   /api/problems   |  GET    | Get all user's problems | 
|   /api/problems   |  POST   | Add a new problem       |
| /api/problems/:id |  PUT    | Update a problem by ID  |
| /api/problems/:id |  DELETE | Delete a problem by ID  |

---

## 🧑‍💻 How to Run Locally

### Clone the repo

    git clone https://github.com/yourusername/coding-journal.git
    cd coding-journal
    
### Install backend dependencies

    cd Backend
    npm install
    
### Install frontend dependencies

    cd ../Frontend
    npm install
    
### Create .env file in the backend folder

    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    PORT=10000
    
### Run the servers

#### In backend
    npm run dev

#### In frontend (new terminal)
    npm start

---

## 📸 Screenshots
<img width="944" height="422" alt="image" src="https://github.com/user-attachments/assets/eba34188-7ced-4f81-8545-ce4381de4746" />
	
---

## 🧠 Future Improvements
🔄 Password reset via email

🌙 Dark mode toggle

🏷️ Add problem tags (e.g., Arrays, DP)

📈 Admin dashboard

🧾 Export problems as PDF/CSV

---

## 🙋‍♀️ Author

Built with ❤️ by Vyshnavi Vunnamatla

---

## 📄 License
This project is licensed under the MIT License.

---

Let me know if you'd like the GitHub description, or help setting up automatic deploy com




## Upgrades for Intelligent Coding Environment
- Monaco Editor integration (frontend) with language selection.
- Topic tagging and filtering for problems.
- Executor microservice scaffold (Docker-based) at `/services/executor` to run Python/Java/C++ securely.
- Executor proxy route at `/api/execute/run` (requires EXECUTOR_URL env variable).
- Updated Problem model to store submission history and topics.

Refer to `services/executor/README` for executor usage.


## Deployment Guide (Vercel + Render)

Frontend (Vercel):
- Import the Frontend folder into Vercel as a new project.
- Set environment variables if needed (e.g., REACT_APP_API_URL).
- Build command: `npm run build` and output directory: `build`.

Backend (Render):
- Create a new Web Service on Render using the Backend folder. Use the provided Dockerfile or Node environment.
- Set environment variables: `MONGO_URI`, `EXECUTOR_URL` (point to executor), `OPENAI_API_KEY`.

Executor (Render or external VM):
- Recommended: run on a small VM or a Docker-enabled host and expose via a secure URL. Set `EXECUTOR_URL` in the backend to this URL.
