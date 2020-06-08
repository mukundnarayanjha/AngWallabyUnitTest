import { Injectable, EventEmitter } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Employee } from '../shared/employee';

@Injectable({
  providedIn: 'root'
})

export class RestApiService {
  apiURL = 'http://localhost:3000/employees';
  apiURL1 = 'http://localhost:3000/employeesUnderObservation';


  constructor(private http: HttpClient) {
  }
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiURL).pipe(
      tap(employees => JSON.stringify(employees)),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getEmployee(id: any): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiURL}/${id}`).pipe(
      tap(employees => JSON.stringify(employees)),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  createEmployee(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiURL, emp)
      .pipe(
        tap(employee => JSON.stringify(employee)),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  updateEmployeeData(id: any, emp: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiURL}/${id}`, emp)
      .pipe(
        tap(employee => JSON.stringify(employee)),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  deleteEmployee(id: any): Observable<{}> {
    return this.http.delete(`${this.apiURL}/${id}`).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  // Under Observation Employee

  getAllUnderObservationEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiURL1).pipe(
      tap(employees => JSON.stringify(employees)),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getUnderObservationEmployee(id: any): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiURL1}/${id}`).pipe(
      tap(employees => JSON.stringify(employees)),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  createUnderObservationEmployee(emp: Employee): Observable<Employee> {
    const employeeData = new Employee();
    employeeData.name = emp.name;
    employeeData.email = emp.email;
    employeeData.phone = emp.phone;
    return this.http.post<Employee>(this.apiURL1, employeeData)
      .pipe(
        tap(employee => JSON.stringify(employee)),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  deleteUnderObservationEmployee(id: any): Observable<void> {
    return this.http.delete<void>(`${this.apiURL1}/${id}`).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
