import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { homework } from '../model/homework';

@Injectable({
  providedIn: 'root'
})
export class HomeworkService {
  private apiUrl = 'https://tutorialhub-backend-final.onrender.com/Homework'; // Cambia esto a tu URL de la API

  constructor(private http: HttpClient) { }

  getHomeworks(): Observable<homework[]> {
    return this.http.get<homework[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getHomeworkById(id: number): Observable<homework> {
    return this.http.get<homework>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createHomework(homework: homework): Observable<homework> {
    console.log('Data sent to create homework:', homework); // Agregar console.log aquí
    return this.http.post<homework>(this.apiUrl, homework)
      .pipe(catchError(this.handleError));
  }

  updateHomework(id: number, homework: homework): Observable<homework> {
    return this.http.put<homework>(`${this.apiUrl}/${id}`, homework)
      .pipe(catchError(this.handleError));
  }

  deleteHomework(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Nuevo método para obtener los detalles de los homework por clientId
  getHomeworkDetailsByClientId(clientId: number): Observable<homework[]> {
    return this.http.get<homework[]>(`${this.apiUrl}/client/${clientId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError('Something bad happened; please try again later.');
  }
  downloadHomework(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/download/${id}`, {
      responseType: 'arraybuffer'
    });
  }
}
