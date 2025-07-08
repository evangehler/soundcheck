# soundcheck
A full-stack album rating and review site built with **FastAPI** and **React (Vite)**.


## Installation

**Pull repository**
```
git clone git@github.com:evangehler/soundcheck.git
```
**Set up python virtual environment in directory**
```
cd soundcheck
python -m venv venv
```
**Enter virtual environment**

Windows Powershell:

```
venv/scripts/activate.ps1 
```
MacOS / Linux:

```
source venv/bin/activate
```
**Download requirements.txt**
```
pip install -r requirements.txt
```
**Download PostgreSQL**

The application expects a PostgreSQL database called "soundcheck" to create this you must first download the software locally

Use: https://www.postgresql.org/download/ if on windows (using v17.5 via EDB installer)

To use with command line interface, add psql to PATH

- Open Start → Search “Environment Variables”

- Click "Edit the system environment variables"

- Click Environment Variables

- Under System variables, find Path → click Edit

- Click New, then paste the path to the bin folder:

It should be under
```
C:\Program Files\PostgreSQL\17\bin
```

**Either in the pgAdmin GUI or the CLI, create a database "soundcheck" using default login:**

```
psql -U postgres
# enter password: admin
CREATE DATABASE soundcheck;
```

Confirm this worked with 
```
-l
```

**Add a .env file in root directory that contains your database info in this format:**

```
DATABASE_URL=postgresql://postgres:<your-password>@localhost/soundcheck
```

For example, with the default user and port 5432 (use this):

```
DATABASE_URL=postgresql://postgres:admin@localhost:5432/soundcheck
```

**Run provided file create_tables.py to create and populate new database:**

```
python create_tables.py
```

**To log into new database directly from CLI:**
```
psql -U postgres -d soundcheck
```

**Utilize SQL Queries to see Table Entries**
```
SELECT * FROM albums;
```

This information is also available from pgAdmin GUI

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
(Ctrl + F5 if blank)

## Development
To load in development mode (with hot reload)

1. Start frontend in dev mode
```
cd frontend
npm install
npm run dev
```

2. Open app at http://localhost:5173/ (Ctrl + F5 if blank)
