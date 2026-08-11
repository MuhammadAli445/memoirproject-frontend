# Memory App FastAPI Authentication Backend & Test Console

This repository provides a FastAPI authentication backend with JWT tokens, password hashing, Google OAuth support, and an interactive web test dashboard.

## Features

- 🔐 **Authentication**: User Registration (`/auth/signup`), Login (`/auth/login`), JWT Refresh (`/auth/refresh`), Protected User Profile (`/auth/me`).
- 🌐 **Google OAuth Integration**: (`/auth/google/login`, `/auth/google/callback`).
- ⚡ **Interactive Test Dashboard**: Embedded UI accessible at `http://localhost:8000/` or standalone at `frontend/index.html`.
- 📡 **Live HTTP Response Inspector**: Real-time logging of HTTP methods, status codes, latencies, and JSON payloads.
- 🛡️ **CORS Enabled**: Configured with `CORSMiddleware` to allow requests from any frontend client or local origin.

---

## How to Run the Backend & Use the Test Form

### 1. Install Dependencies

Ensure your virtual environment is active and dependencies are installed:

```bash
pip install -r requirements.txt
```

### 2. Start the FastAPI Backend Server

Run the development server with `uvicorn`:

```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Open the Testing Dashboard

Once the server is running:
- Open your browser and navigate to: **`http://localhost:8000/`**
- Or open `frontend/index.html` directly in any web browser.

### 4. How to Test

- Click **🪄 Quick Fill Data** to generate sample user credentials.
- Click **Sign Up & Issue Tokens** to register a new user.
- Click **Fetch My Profile** to test authorized access via `Bearer <access_token>` to `GET /auth/me`.
- Click **Request New Access Token** to test `POST /auth/refresh`.
- Click **🚀 Run All Tests Automatically** to execute an automated sequence testing all authentication endpoints!

---

## Running Automated Unit Tests

Run the test suite with `pytest`:

```bash
pytest
```
