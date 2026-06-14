# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Run & Development

Prerequisites:

- Node.js (16+) and `npm` for the frontends.
- Python 3.8+ and `pip` for the backend.

Backend (Flask):

1. Open a terminal and change to the `backend` folder:

```bash
cd backend
```

2. Create and activate a virtual environment (optional but recommended):

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate
```

3. Install required Python packages:

```bash
pip install Flask flask-cors flask-jwt-extended
```

4. Start the backend server (development mode, runs on port 5000):

```bash
python app.py
```

The backend will create the SQLite database file `resort.db` automatically when first started.

Admin frontend:

1. Change to the `admin` folder:

```bash
cd admin
```

2. Install Node dependencies and start the dev server:

```bash
npm install
npm start
```

React frontend (site):

1. Change to the `React` folder:

```bash
cd React
```

2. Install dependencies and start the dev server:

```bash
npm install
npm start
```

Notes:

- If both frontends try to use the same port (3000), set the `PORT` env var before running, for example `PORT=3001 npm start` (on Windows PowerShell: `$env:PORT=3001; npm start`).
- Remove generated artifacts from version control: delete `admin/build/` and any `__pycache__/` folders; add them to `.gitignore` if not already ignored.
- If you want a single place to manage backend dependencies, consider adding a `requirements.txt` in the `backend` folder with: `Flask\nflask-cors\nflask-jwt-extended`.
