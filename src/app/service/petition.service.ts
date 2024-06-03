import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Petition } from '../model/petition';
import { Console } from 'console';

@Injectable({
  providedIn: 'root',
})
export class PetitionService {
  petitionService: any;
  acceptPetition(id: number, newMessage: string) {
    throw new Error('Method not implemented.');
  }
  getUserById(userId: number): import("../model/client").client | undefined {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'https://tutorialhub-backend-final.onrender.com'; // Corrige la URL base aquí

  constructor(private http: HttpClient) { }
/**
 *  Función para agregar una petición a la base de datos 
 * @param classId 
 * @param userId 
 * @param message 
 * @param state 
 * @param date 
 * @returns  devuelve la petición agregada
 */
  addPetition(classId: number, userId: number, message: string, state: string, date: Date): Observable<Petition> {
    const petitionData = {
      message: message,
      state: "Pendiente",
      date: date,
      clientId: userId, // Asegúrate de enviar userId como clientId
      classroomId: classId // Asegúrate de enviar classId como classroomId
    };
    return this.http.post<Petition>(`${this.apiUrl}/petitions`, petitionData);
  }
/**
 * funcion para obtener todas las petición de la base de datos
 * @returns 
 */
  getPetitions(): Observable<Petition[]> {
    return this.http.get<Petition[]>(`${this.apiUrl}/petitions`);
  }
  /**
   * funcion para actualizar una petición en la base de datos 
   * @param petition 
   * @returns 
   */

  updatePetition(petition: Petition): Observable<Petition> {
    return this.http.put<Petition>(`${this.apiUrl}/petitions/${petition.id}`, petition);
  }
  /**
   *  funcion para eliminar una petición de la base de datos 
   * @param petitionId 
   * @returns 
   */

  denyPetition(petitionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/petitions/${petitionId}`);
  }
  /**
   * funcion para actualizar el estado y el mensaje de una petición en la base de datos 
   * @param petition 
   * @param newState 
   * @param newMessage 
   * @returns devuelve un observador vaci o con un error 
   */

 
  updatePetitionStateAndMessage(petition: Petition, newState: string, newMessage: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/petitions/${petition.id}`, { state: newState, message: newMessage })
      .pipe(
        catchError((error: any) => {
          console.error('Error updating petition state and message:', error);
          throw error; // Reenviar el error para que sea manejado por quien llama a esta función
        })
      );
  }
  /**
   * funcion para obtener las petición de un profesor de la base de datos 
   * @param teacherId 
   * @returns devuelve las petición del profesor
   */
  getPetitionsByTeacher(teacherId: number, state: string): Observable<Petition[]> {
    const url = `${this.apiUrl}/petitions/teacher/${teacherId}?state=${state}`;

    return this.http.get<Petition[]>(url).pipe(
      tap((petitions: Petition[]) => {
        // Convertir las fotos de las peticiones a cadena base64
        petitions.forEach(petition => {
          if (petition.photo) {
            // Verificar si la foto es una cadena antes de intentar convertirla
            if (typeof petition.photo === 'string') {
              petition.photoBase64 = petition.photo; // No hay necesidad de conversión
            } else {
              petition.photoBase64 = this.arrayBufferToBase64(petition.photo);
            }
          }
        });
        console.log('Datos devueltos por la consulta HTTP:', petitions);
      })
    );
  }

/**
 *  Función para convertir un ArrayBuffer a una cadena base64 
 * @param buffer 
 * @returns devuelve la cadena base64 
 */
  // Método para convertir un ArrayBuffer a una cadena base64
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  /**
   *  funcion para obtener las petición de un cliente de la base de datos 
   * @param clientId 
   * @returns devuelve las petición del cliente
   */
  getPetitionsByClientId(clientId: number, state: string): Observable<Petition[]> {
    const url = `${this.apiUrl}/petitions/${clientId}?state=${state}`;

    console.log(clientId);
    return this.http.get<Petition[]>(url).pipe(
      tap((petitions: Petition[]) => {
        // Convertir las fotos de las peticiones a cadena base64
        petitions.forEach(petition => {
          if (petition.photo) {
            // Verificar si la foto es una cadena antes de intentar convertirla
            if (typeof petition.photo === 'string') {
              petition.photoBase64 = petition.photo; // No hay necesidad de conversión
            } else {
              petition.photoBase64 = this.arrayBufferToBase64(petition.photo);
            }
          }
        });
      })
    );
  }

}