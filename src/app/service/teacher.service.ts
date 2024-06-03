// teacher.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { teacher } from '../model/teacher';
import * as bcrypt from 'bcryptjs';


@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrl = 'https://tutorialhub-backend-final.onrender.com';
  private currentTeacher: teacher | null = null;
  teacherProfileUpdatedSubject: Subject<teacher | null> = new Subject<teacher | null>();

  constructor(private http: HttpClient) { }
/**
 * funcion para agregar un profesor a la base de datos 
 * @param teacherData 
 * @returns devuelve el profesor agregado
 */
  saveTeacher(teacherData: teacher): Observable<teacher | null> {
    return this.http.post<teacher>(`${this.apiUrl}/teachers`, teacherData).pipe(
      catchError((error) => {
        console.error('Error al guardar el profesor:', error);
        return of(null);
      })
    );
  }

/**
 * funcion para obtener un profesor por su nombre de usuario y contraseña 
 * @param username 
 * @param password 
 * @returns devuelve el profesor con el nombre de usuario y contraseña especificados
 */

  loginTeacherWithUsernameAndPassword(username: string, password: string): Observable<teacher | null> {
    const loginData = { username: username, password: password };
    
    return this.http.get<teacher>(`${this.apiUrl}/teachers/login`, { params: { username, password } }).pipe(
      tap((teacher: teacher) => {
      
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al iniciar sesión:', error.message);
        return of(null);
      })
    );
  }
/**
 * funcion para eliminar un profesor de la base de datos 
 * @param teacherId 
 * @returns devuelve un valor booleano que indica si se elimino el profesor 
 */

  deleteTeacher(teacherId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/teachers/${teacherId}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar el profesor:', error);
        return of(false);
      })
    );
  }
  /**
   * funcion para modificar un profesor de la base de datos 
   * @param teacherId 
   * @param modifiedData 
   * @returns  devuelve el profesor modificado 
   */

  modifyTeacher(teacherId: number, modifiedData: teacher): Observable<teacher | null> {
    return this.http.put<teacher>(`${this.apiUrl}/teachers/${teacherId}`, modifiedData).pipe(
      catchError((error) => {
        console.error('Error al modificar el profesor:', error);
        return of(null);
      }),
      map((updatedTeacher) => {
        if (updatedTeacher) {
          this.teacherProfileUpdatedSubject.next(updatedTeacher);
        }
        return updatedTeacher;
      })
    );
  }
  /**
   *  funcion para establecer el profesor actual 
   * @param teacher 
   */

  setCurrentTeacher(teacher: teacher | null): void {
    this.currentTeacher = teacher;
  }
/**
 * funcion para obtener el profesor actual 
 * @returns 
 */
  getCurrentTeacher(): teacher | null {
    return this.currentTeacher;
  }
/**
 * funcion para obtener un profesor por su ID 
 */
  getTeacherById(teacherId: number): Observable<teacher | null> {
    return this.http.get<teacher>(`${this.apiUrl}/teachers/${teacherId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener información del profesor por ID:', error);
        return of(null);
      })
    );
  }
  /**
   * funcion para obtener un perfil de un profesor por su nombre de usuario 
   * @param username 
   * @returns  devuelve el profesor con el nombre de usuario especificado
   */

  loadTeacherProfileByUsername(username: string): Observable<teacher | null> {
    return this.http.get<teacher[]>(`${this.apiUrl}/teachers?username=${username}`).pipe(
      map(teachers => teachers[0] || null),
      catchError((error) => {
        console.error('Error al cargar el perfil del profesor por nombre de usuario:', error);
        return of(null);
      })
    );
  }
}
