# soundcheck
A full-stack album rating and review site built with **FastAPI** and **React (Vite)**.


## Installation

1. Pull repository
```
git clone git@github.com:evangehler/soundcheck.git
```
2. Set up python virtual environment in directory
```
cd soundcheck
python -m venv venv
```
3. Enter virtual environment 

```
# Windows Powershell
venv/scripts/activate.ps1 
```

```
# MacOS / Linux
source venv/bin/activate
```
4. Download requirements.txt
```
pip install -r requirements.txt
```
5. Download PostgreSQL @ https://www.postgresql.org/download/ if on windows (using v17.5 via EDB installer)


## Running App Locally
 To launch as built:

 1. Start Frontend
 ```
 cd frontend
 npm install
 ```

 2. Start FastAPI backend 
```
cd ..
python run.py
```

3. Open at http://localhost:8000/ 

## Development
To load in development mode (with hot reload)

1. Start frontend in dev mode
```
cd frontend
npm install
npm run dev
```

2. Open app at http://localhost:5173/
