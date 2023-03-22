import psycopg2
from flask import Flask

app = Flask(__name__)

# Connect to the database
try:
    conn = psycopg2.connect(
        host="localhost",
        database="HR database",
        user="postgres",
        password="2000"
    )
except Exception as e:
    print("Error while connecting to the database ", e)

cur = conn.cursor()

# Create tables
queries = [
    """CREATE TABLE employee(
    emp_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    middle_name VARCHAR(50),
    last_name VARCHAR(50),
    bday DATE,
    email VARCHAR(100),
    salary INTEGER NOT NULL,
    latitude DECIMAL(7,4),
    longitude DECIMAL(7,4),
    start_date DATE NOT NULL,
    CONSTRAINT check_name CHECK (first_name IS NOT NULL OR middle_name IS NOT NULL OR last_name IS NOT NULL),
    CONSTRAINT check_full_name CHECK (LENGTH(COALESCE(first_name, '') || COALESCE(middle_name, '') || COALESCE(last_name, '')) <= 50),
    CONSTRAINT age_check CHECK (age(date_trunc('year', now()), bday) >= INTERVAL '18 years')
    )""",
    """CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(50) UNIQUE,
    ceo_id INTEGER,
    cto_id INTEGER,
    lead_id INTEGER,
    CONSTRAINT fk_ceo_id FOREIGN KEY (ceo_id)
        REFERENCES employee (emp_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT fk_cto_id FOREIGN KEY (cto_id)
        REFERENCES employee (emp_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT fk_lead_id FOREIGN KEY (lead_id)
        REFERENCES employee (emp_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
    )""",
    """ CREATE TABLE hr_notes(
    notes_id SERIAL PRIMARY KEY,
    emp_id INTEGER,
    notes_date DATE NOT NULL,
    context VARCHAR(1000) NOT NULL,
    CONSTRAINT fk_emp_id FOREIGN KEY (emp_id)
        REFERENCES employee (emp_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    )""",
    """CREATE TABLE emp_works_on(
    team_id INTEGER,
    emp_id INTEGER,
    CONSTRAINT team_emp_unique UNIQUE (team_id, emp_id),
    CONSTRAINT fk_emp_id FOREIGN KEY (emp_id)
        REFERENCES employee (emp_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_team_id FOREIGN KEY (team_id)
        REFERENCES teams (team_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    )"""
]

for query in queries:
    cur.execute(query)
conn.commit()
cur.close()
conn.close()