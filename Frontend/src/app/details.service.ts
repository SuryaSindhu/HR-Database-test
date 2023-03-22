import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { employee } from './interface';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  constructor(private http: HttpClient) { }
  private baseUrl = "http://127.0.0.1:5000";

  // Fetch details of all employees
  getEmpDetails():Observable<employee[]>{
    return this.http.get<employee[]>(this.baseUrl+'/emp-details').pipe(
      tap(data => console.log('EMP: ', JSON.stringify(data))),
      catchError(this.errorHandler)
    );
  }

  // Fetch details of all teams
  getTeamDetails():Observable<any>{
    return this.http.get<any>(this.baseUrl+'/team-details').pipe(
      tap(data => console.log('TEAMS: ', JSON.stringify(data))),
      catchError(this.errorHandler)
    );
  }

  // Fetch hr-notes of an employee
  getHrNotes(emp_id: Number):Observable<any>{
    return this.http.get<any>(this.baseUrl+'/hr-notes/'+ emp_id).pipe(
      tap(data => console.log('HR notes ', JSON.stringify(data))),
      catchError(this.errorHandler)
    );
  }

  // Fetch details of an employee
  getEmpById(emp_id: Number):Observable<any>{
    return this.http.get<any>(this.baseUrl+'/emp/'+ emp_id).pipe(
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.errorHandler)
    );
  }

  // Fetch details of a team
  getTeamsList():Observable<any>{
    return this.http.get<any>(this.baseUrl+'/teams-list').pipe(
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.errorHandler)
    );
  }

  // Fetch list of all employees with ids
  getEmpsList():Observable<any>{
    return this.http.get<any>(this.baseUrl+'/emp-list').pipe(
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.errorHandler)
    );
  }

  // Delete an employee
  deleteEmp(emp_id: Number):Observable<any> {
    return this.http.delete<any>(this.baseUrl+'/emp/'+emp_id);
  }

  // Delete a team
  deleteTeam(emp_id: Number):Observable<any> {
    return this.http.delete<any>(this.baseUrl+'/teams/'+emp_id);
  }

  // Create new hr-notes for an employee
  postNewHrNote(emp_id:Number, body: any):Observable<any>{
    return this.http.post<any>(this.baseUrl+'/hr-notes/'+emp_id, body);
  }

  // Create new employee
  createNewEmp(body:any): Observable<any> {
    return this.http.post<any>(this.baseUrl+'/emp/new-emp', body);
  }

  // Create new team
  createNewTeam(body:any): Observable<any> {
    return this.http.post<any>(this.baseUrl+'/teams/new-team', body).pipe(
      tap(data => console.log('created')),
      catchError(this.errorHandler)
    );
  }

  // Add an employee to a team
  addEmpToTeam(body:any): Observable<any> {
    return this.http.post<any>(this.baseUrl+'/add-to-team', body).pipe(
      tap(data => console.log('created')),
      catchError(this.errorHandler)
    );
  }

  // Update details of an employee
  updateEmp(emp_id: Number, body:any):Observable<any>{
    return this.http.put<any>(this.baseUrl+'/emp/'+emp_id,body);
  }

  // Error handler
  errorHandler(error: HttpErrorResponse){
    console.log(error);
    return throwError(error.message);
  }
}
