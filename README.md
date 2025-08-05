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
./venv/scripts/activate
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

**The following is the recommended .env for basic dev**
```
DATABASE_URL=postgresql://postgres:admin@localhost:5432/soundcheck
EMAIL_ADDRESS =soundcheck.business@gmail.com
EMAIL_PASSWORD =gauv ypcc sesf deer
EMAIL_ENABLES = false
```

**To populate database run any of the dbX.py files**

For example:

```
python db4.py
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

## Running App Locally in Dev Mode
 
 1. Start FastAPI backend 
```
cd ..
python run.py
```

2. Start frontend in dev mode
```
cd frontend
npm install
npm run dev
```

3. Open app at http://localhost:5173/ (Ctrl + F5 if blank)
