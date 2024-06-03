import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { client } from '../model/client';
import * as bcrypt from 'bcryptjs';
import { LoginComponent } from '../page/login/login.component';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://tutorialhub-backend-final.onrender.com';
  private currentUserId: number | null = null;
  constructor(private http: HttpClient) { }
  /**
   *  funcion para iniciar la sesion del cliente en la base de datos 
   * @param username 
   * @param password 
   * @returns devuelve el cliente con el nombre de usuario y contraseña especificados
   */
  loginClientWithUsernameAndPassword(username: string, password: string): Observable<client | null> {
    const loginData = { username: username, password: password }; // No se hace hash de la contraseña aquí
   
    return this.http.post<client>(`${this.apiUrl}/clients/login`, loginData).pipe(
      tap((clienteEncontrado: client) => {
      
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al iniciar sesión:', error.message);
        return of(null);
      })
    );
  }
  /**
   * funcion para agregar un usuario a la base de datos 
   * @param userData 
   * @returns devuelve el usuario agregado
   */
  saveUser(userData: client): Observable<client | null> {
    return this.http.post<client>(`${this.apiUrl}/clients`, userData).pipe(
      catchError((error) => {
        console.error('Error al guardar el usuario:', error);
        return of(null);
      })
    );
  }
  /**
   * funcion para obtener un usuario por su ID 
   * @returns 
   */
  getUserById(): Observable<client | null> {
    const userId = LoginComponent.userId; // Obtener el ID del usuario del LoginComponent
    if (!userId) {
      console.error('No se proporcionó un ID de usuario válido.');
      return of(null);
    }

    return this.http.get<client>(`${this.apiUrl}/clients/${userId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener el usuario por ID:', error);
        return of(null);
      })
    );
  }
  // Método para obtener el ID del usuario por su nombre de usuario
  getUserIdByUsername(username: string): Observable<number | null> {
    return this.http.get<client>(`${this.apiUrl}/clients/username/${username}`).pipe(
      map((user: client) => user.id), // Mapea el resultado para obtener solo el ID
      catchError((error: HttpErrorResponse) => {
        console.error('Error al obtener el ID del usuario:', error.message);
        return of(null);
      })
    );
  }
  /**
   * funcion para eliminar un usuario de la base de datos 
   * @param userId 
   * @returns  devuelve un valor booleano que indica si se elimino el usuario
   */

  deleteUser(userId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/clients/${userId}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar el usuario:', error);
        return of(false);
      })
    );
  }
  /**
   * funcion para modificar un usuario de la base de datos 
   * @param userId 
   * @param updatedUserData 
   * @returns devuelve el usuario modificado
   */
  updateUser(userId: number, updatedUserData: client): Observable<client | null> {
    return this.http.put<client>(`${this.apiUrl}/clients/${userId}`, updatedUserData).pipe(
      catchError((error) => {
        console.error('Error al actualizar el usuario:', error);
        return of(null);
      })
    );
  }

  // Método para almacenar el ID del usuario actual
  // Método para guardar el ID del usuario actual
  setCurrentUserId(userId: number): void {
    this.currentUserId = userId;
  }

  // Método para obtener el ID del usuario actual
  getCurrentUserId(): number | null {
    return this.currentUserId;
  }
  /**
   * funcion para comprobar la existencia de un usuario por nombre de usuario o correo electrónico 
   * @param username 
   * @param email 
   * @returns  devuelve el usuario
   */
  existsByUsernameOrEmail(username: string, email: string): Observable<client | null> {
    const userData = { username: username, email: email };
    return this.http.post<client>(`${this.apiUrl}/clients/existsByUsernameOrEmail`, userData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al comprobar la existencia de usuario por nombre de usuario o correo electrónico:', error.message);
        return of(null);
      })
    );
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getDistinctClientInfoByTeacherId(teacherId: number, classId: number, option: number): Observable<Object[]> {
    const url = `${this.apiUrl}/clients/distinct-client-info/${teacherId}/${classId}/${option}`;
    return this.http.get<Object[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al obtener la información de los clientes:', error.message);
        return of([]);
      })
    );
  }


}