import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Assessment } from '../model/assessment'; // Corregir la importación

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  private apiUrl = 'https://tutorialhub-backend-final.onrender.com/assessments';

  constructor(private http: HttpClient) { }
/**
 *  Funcion para crear una valoración en la base de datos 
 * @param assessment 
 * @returns 
 */
  createAssessment(assessment: Assessment): Observable<Assessment> {
    console.log('Enviando evaluación:', assessment);
    return this.http.post<Assessment>(this.apiUrl, assessment).pipe(
      catchError((error: any) => {
        if (error instanceof HttpResponse && error.status === 400) {
          // Manejo de errores de solicitud incorrecta (BAD_REQUEST)
          console.error('Error en la solicitud:', error.statusText);
        } else if (error instanceof HttpResponse && error.status === 500) {
          // Manejo de errores internos del servidor (INTERNAL_SERVER_ERROR)
          console.error('Error interno del servidor:', error.statusText);
        } else {
          // Manejo de otros errores
          console.error('Error:', error.message);
        }
        // Devolvemos un observable con un error para que el componente pueda manejarlo adecuadamente
        return throwError('Ocurrió un error al crear la evaluación. Por favor, inténtalo de nuevo.');
      })
    );
  }
  // Función para obtener una evaluación por su ID
  getAssessmentsByTeacherId(teacherId: number): Observable<Assessment[]> {
    const url = `${this.apiUrl}/${teacherId}`;
    return this.http.get<Assessment[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error fetching petitions by client id';
        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `${errorMessage}: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          errorMessage = `${errorMessage}: ${error.status} - ${error.error.message}`;
        }
        console.error(errorMessage);
        throw error; // Reenviar el error para que sea manejado por quien llama a esta función
      })
    );
  }
  getAverageAssessmentByTeacherId(teacherId: number): Observable<number> {
   
    const url = `${this.apiUrl}/average/${teacherId}`;
    return this.http.get<number>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(this.handleError(error));
      })
    );
  }

  // Función para manejar errores
  private handleError(error: any): string {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return errorMessage;
  }
}
  

