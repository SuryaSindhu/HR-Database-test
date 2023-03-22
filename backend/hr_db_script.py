import psycopg2
from flask import Flask, request, jsonify, render_template
from psycopg2.extras import RealDictCursor
import json
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

# Connect to the database
def db_connection():
    conn = None
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="HR database",
            user="postgres",
            password="2000"
        )
    except Exception as e:
        print("Error while connecting to the database ", e)
    return conn

@app.route('/', methods=['GET'])
def root():
    return render_template('index.html') # Return index.html 

#API to get details of all teams
@app.route('/team-details', methods=['GET'])
def get_team_details():
    conn = db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    queries = [
                """SELECT team_id,team_name FROM teams""",
                """SELECT COALESCE(E.first_name, '')||' '|| COALESCE(E.middle_name,'') ||' '|| COALESCE(E.last_name,'') as ceo, T.team_id as team_id, T.team_name as team_name FROM employee E RIGHT JOIN teams T ON T.ceo_id = E.emp_id""",
                """SELECT COALESCE(E.first_name, '')||' '|| COALESCE(E.middle_name,'') ||' '|| COALESCE(E.last_name,'') as cto, T.team_id as team_id, T.team_name as team_name FROM employee E RIGHT JOIN teams T ON T.cto_id = E.emp_id""",
                """SELECT COALESCE(E.first_name, '')||' '|| COALESCE(E.middle_name,'') ||' '|| COALESCE(E.last_name,'') as team_lead, T.team_id as team_id, T.team_name as team_name FROM employee E RIGHT JOIN teams T ON T.lead_id = E.emp_id""",
                """SELECT COALESCE(E.first_name, '')||' '|| COALESCE(E.middle_name,'') ||' '|| COALESCE(E.last_name,'') as emp_name, T.team_id as team_id FROM employee E Right JOIN  emp_works_on T ON T.emp_id = E.emp_id"""
            ]
    results = {}
    dict_keys = ['team_details','teams_ceo','teams_cto','teams_lead','teams_emp']
    i = 0

    if request.method == 'GET':
        for query in queries:
            cur.execute(query)
            result = cur.fetchall()
            print(result)
            results[dict_keys[i]] = result
            i=i+1

        cur.close()
        conn.close()

        if results['team_details']!=[]:
            for i in range(len(results['team_details'])):
                results['team_details'][i]['ceo'] = results['teams_ceo'][i]['ceo']
                results['team_details'][i]['cto'] = results['teams_cto'][i]['cto']
                results['team_details'][i]['lead'] = results['teams_lead'][i]['team_lead']
                results['team_details'][i]['emps'] = []
                for j in range(len(results['teams_emp'])):
                    if results['teams_emp'][j]['team_id'] == results['team_details'][i]['team_id']:
                        results['team_details'][i]['emps'].append(results['teams_emp'][j]['emp_name'])

            results.pop('teams_ceo')
            results.pop('teams_cto')
            results.pop('teams_lead')
            results.pop('teams_emp')
            response = jsonify(results['team_details'])
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
            return response
        else:
            return {"message": "No team records found"},204
        

# API to get details of all employees
@app.route('/emp-details', methods=['GET'])
def get_emp_details():
    conn = db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT emp_id AS Employee_id, COALESCE(first_name, '')||' '|| COALESCE(middle_name,'') ||' '|| COALESCE(last_name,'') as FullName , CAST(bday AS text) AS DOB, email, salary AS salary_USD, salary*82 AS salary_INR, CAST(latitude as text), CAST(longitude as text), CAST(start_date AS text) from employee;")
    results = cur.fetchall()
    print(results)
    results = jsonify(results)
    cur.close()
    conn.close()
    results.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
    return results
    

# API to perform delete, fetch and update an employee record
@app.route('/emp/<int:id>', methods=['DELETE', 'PUT', 'GET'])
def emp_actions(id):
    conn = db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if request.method == 'DELETE':
        cur.execute("DELETE FROM employee WHERE emp_id=%s;",(id,))
        conn.commit()
        cur.close()
        conn.close()
        results = jsonify({'success': True})
        results.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
        return results
    
    if request.method == 'GET':
        cur.execute("SELECT emp_id AS Employee_id, first_name,middle_name, last_name , CAST(bday AS text) AS DOB, email, salary AS salary_USD, CAST(latitude as text), CAST(longitude as text), CAST(start_date AS text) from employee WHERE emp_id=%s;",(id,))
        results = cur.fetchall()
        print(results)
        results = jsonify(results)
        cur.close()
        conn.close()
        results.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
        return results

    if request.method == 'PUT':
        data = request.get_json()
        firstName = data['firstName']
        middleName = data['middleName']
        lastName = data['lastName']
        bday = data['dob']
        email = data['email']
        salary = data['salary']
        latitude = data['latitude']
        longitude = data['longitude']
        if(latitude == ''):
            latitude = 0
        if(longitude == ''):
            longitude = 0
        startDate = data['startDate']
        try:
            cur.execute("UPDATE employee SET first_name=%s, middle_name=%s,last_name=%s,bday=%s,email=%s,salary=%s,latitude=%s,longitude=%s, start_date=%s WHERE emp_id=%s",
            (firstName, middleName, lastName, bday, email, salary, latitude, longitude, startDate, id))

            conn.commit()
            cur.close()
            conn.close()
            results = jsonify({'success': True})
        except TypeError as error:
            results = jsonify(error)

        results.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
        return results

# API to create new employee
@app.route('/emp/new-emp', methods=['POST'])
def create_new_emp():
    conn = db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    data = request.get_json()
    firstName = data['firstName']
    middleName = data['middleName']
    lastName = data['lastName']
    bday = data['dob']
    if (bday == ''):
        bday = None
    email = data['email']
    salary = data['salary']
    latitude = data['latitude']
    longitude = data['longitude']
    if(latitude == ''):
        latitude = None
    if(longitude == ''):
        longitude = None
    startDate = data['startDate']
    try:
        cur.execute("INSERT INTO employee(first_name, middle_name,last_name,bday,email,salary,latitude,longitude, start_date) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                (firstName,middleName ,lastName ,bday ,email ,salary ,latitude ,longitude ,startDate ))
    
        conn.commit()
        cur.close()
        conn.close()
        results = jsonify({'success': True})
    except (psycopg2.OperationalError, psycopg2.DataError, psycopg2.TypeError ) as error:
        results = jsonify(error)

    results.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
    return results

# API to get and add hr-notes of an employee
@app.route('/hr-notes/<int:id>', methods=['GET','POST'])
def hr_notes(id):
    conn = db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if request.method == 'GET':
        cur.execute("SELECT CAST(notes_date as text) date, context FROM hr_notes WHERE emp_id=%s;", (id,))
        results = cur.fetchall()
        print(results)
        results = jsonify(results)
        cur.close()
        conn.close()
        results.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
        return results
        

    if request.method == 'POST':
        data = request.get_json()
        date = data['date']
        context = data['context']
        cur.execute("INSERT INTO hr_notes(emp_id, notes_date, context) VALUES (%s,%s,%s)",(id, date, context))
        conn.commit()
        cur.close()
        conn.close()
        results = jsonify({'success': True})
        results.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
        return results

# API to get list of teams with their ids
@app.route('/teams-list', methods=(['GET']))
def get_teams_list():
    conn = db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT team_id, team_name FROM teams")
    results = cur.fetchall()
    print(results)
    results = jsonify(results)
    cur.close()
    conn.close()
    results.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
    return results

#API to get list of employees with their ids
@app.route('/emp-list', methods=(['GET']))
def get_emp_list():
    conn = db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT emp_id, COALESCE(first_name, '')||' '|| COALESCE(middle_name,'') ||' '|| COALESCE(last_name,'') as FullName from employee")
    results = cur.fetchall()
    print(results)
    results = jsonify(results)
    cur.close()
    conn.close()
    results.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
    return results

#API to add an employee to a team
@app.route('/add-to-team', methods=(['POST']))
def add_to_team():
    conn = db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    data = request.get_json()
    position = data['position']
    team_id = data['team_id']
    emp_id = data['emp_id']
    if position == 'employee':
        cur.execute("INSERT INTO emp_works_on(team_id, emp_id) VALUES (%s,%s)", (team_id, emp_id))
    else: #ceo cto lead
        if position=='ceo':
            cur.execute("UPDATE teams SET ceo_id= %s WHERE team_id = %s", (emp_id, team_id))
        elif position == 'cto':
            cur.execute("UPDATE teams SET cto_id= %s WHERE team_id = %s", (emp_id, team_id))
        elif position == 'team lead':
            cur.execute("UPDATE teams SET lead_id= %s WHERE team_id = %s", (emp_id, team_id))

    conn.commit()
    cur.close()
    conn.close()
    results = jsonify({'success': True})
    results.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
    return results

#API to delete a team
@app.route('/teams/<int:id>', methods=(['DELETE']))
def delete_project(id):
    conn = db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if request.method == 'DELETE':
        cur.execute("DELETE FROM teams WHERE team_id=%s;", (id,))
        conn.commit()
        results = jsonify({'success': True})
        results.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
        return results

# API to create a new team
@app.route('/teams/new-team', methods=(['POST']))
def create_team():
    conn = db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    data = request.get_json()
    ceo = data['ceo']
    cto = data['cto']
    lead = data['lead']
    teamName= data['teamName']
    # sql = "INSERT INTO teams(team_name, ceo_id, cto_id, lead_id) VALUES({},{},{},{})".format(teamName, ceo,cto,lead)
    cur.execute("INSERT INTO teams(team_name, ceo_id, cto_id, lead_id) VALUES(%s,%s,%s,%s)",(teamName,ceo,cto,lead))

    conn.commit()
    cur.execute("SELECT team_id FROM teams WHERE team_name=%s", (teamName,))
    team= dict(cur.fetchone())
    team_id = team['team_id']
    emps = (data['emps'])
    for i in emps:
        cur.execute("INSERT INTO emp_works_on(team_id, emp_id) VALUES(%s,%s)",(team_id, i))
        conn.commit()
    cur.close()
    conn.close()
    results = jsonify({'success': True})
    results.headers.add('Access-Control-Allow-Origin', 'http://localhost:4200')
    return results

if __name__ == '__main__':
    app.run(debug=True)