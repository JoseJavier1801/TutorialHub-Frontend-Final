import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Class } from '../model/class';
import { TeacherService } from './teacher.service';
import { teacher } from '../model/teacher';

import { throwError } from 'rxjs';
import { Console } from 'console';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private apiUrl = 'https://tutorialhub-backend-final.onrender.com/classrooms';
  mapService: any;

  constructor(private http: HttpClient) { }
  /**
   *  Función para agregar una clase a la base de datos 
   * @param newClass 
   * @returns devuelve la clase agregada 
   */

  addClass(newClass: Class): Observable<Class> {
    return this.http.post<Class>(this.apiUrl, newClass).pipe(
      catchError((error: any) => { // Aquí especificamos el tipo 'any' para la variable 'error'
        console.error('Error al agregar la clase:', error);
        if (error.status === 400 && error.error && error.error.message && error.error.message.includes('Teacher does not exist')) {
          return throwError(new Error('Teacher does not exist'));
        } else {
          return throwError(error);
        }
      })
    );
  }
  /**
   *  Función para obtener todas las clases de la base de datos 
   * @returns 
   */
  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(this.apiUrl);
  }


  /**
   *  Función para obtener una clase por su ID 
   * @param classId 
   * @returns devuelve la clase con el ID especificado 
   */
  getClassById(classId: number): Observable<Class | undefined> {
    return this.http.get<Class>(`${this.apiUrl}/${classId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener la clase:', error);
        return of(undefined); // Devolver undefined en caso de error
      })
    );
  }
  /**
   *  Función para eliminar una clase de la base de datos 
   * @param classId 
   * @returns devuelve un observador vaci o con un error 
   */

  deleteClass(classId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${classId}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar la clase:', error);
        throw error;
      })
    );
  }
  getClassesByTeacherId(teacherId: number): Observable<Class[]> {
    const url = `${this.apiUrl}/teacher/${teacherId}`;
    return this.http.get<Class[]>(url).pipe(
      map(classes => {

        const modifiedClasses = classes.map(cls => {
          // Convertir la foto del profesor a una cadena base64
          if (cls.teacher && cls.teacher.photo) {
            // Verificar si la foto es una cadena antes de intentar convertirla
            if (typeof cls.teacher.photo === 'string') {
              cls.teacher.photoBase64 = cls.teacher.photo; // No hay necesidad de conversión
            } else {
              cls.teacher.photoBase64 = this.arrayBufferToBase64(cls.teacher.photo);
            }
          }
          return cls;
        });

        return modifiedClasses;
      })
    );
  }

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
   *  Función para obtener todos los detalles de las clases de la base de datos 
   * @returns devuelve un observable con los detalles de las clases
   */
  getAllClassroomDetails(): Observable<Class[]> {
    const url = `${this.apiUrl}/details`;
    return this.http.get<Object[]>(url).pipe(

      map(classDetails => {
        
        const modifiedDetails = classDetails.map(detail => {
          const cls: Class = detail as Class; // Realiza un cast del detalle a la clase Class

          if (cls.teacher && cls.teacher.photo) {
            // Verificar si la foto es una cadena antes de intentar convertirla
            if (typeof cls.teacher.photo === 'string') {
              cls.teacher.photoBase64 = cls.teacher.photo; // No hay necesidad de conversión
            } else {
              cls.teacher.photoBase64 = this.arrayBufferToBase64(cls.teacher.photo);
            }
          }
          return cls;
        });

        return modifiedDetails;
      })
    );
  }
  /**
   *  Función para actualizar una clase de la base de datos y devolver la clase actualizada
   * @param id 
   * @param classroom 
   * @returns  devuelve un observable con la clase actualizada
   */
  updateClassroom(id: number, classroom: Class): Observable<Class | null> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Class>(url, classroom, { headers: { 'Content-Type': 'application/json' } }).pipe(
      catchError((error) => {
        console.error('Error al actualizar el aula:', error);
        throw error;
      })
    );
  }

  /**
   *  Función para buscar clases por categoría, localidad y código postal
   * @param category 
   * @param localidad 
   * @param postalCode 
   * @returns  devuelve un observable con las clases encontradas
   */
  searchClassrooms(category: string): Observable<Class[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }


    return this.http.get<Class[]>(`${this.apiUrl}/seeker`, { params }).pipe(
      catchError((error) => {
        console.error('Error al buscar clases:', error);
        throw error;
      })
    );
  }
  getClassesByPoint(lat: string, lng: string, radiusInMeters: number): Observable<Class[]> {
    const params = new HttpParams()
      .set('lat', lat)
      .set('lng', lng)
      .set('radiusInMeters', radiusInMeters.toString());

    return this.http.get<Class[]>(`${this.apiUrl}/classes-by-point`, { params })
      .pipe(
        tap(classes => {
          console.log('Classes encontradas:');
          console.log(classes);
        }),
        catchError(error => {
          console.error('Error al obtener las clases por punto:', error);
          throw error;
        })
      );
  }


  getClassesByFilter(minPrice: number | null, maxPrice: number | null, filterValue: number): Observable<Class[]> {
    let params = new HttpParams();
    console.log("minPrice:", minPrice, "maxPrice:", maxPrice, "filterValue:", filterValue);

    // Establecer minPrice y maxPrice en 0 si no se proporcionan valores
    if (minPrice !== null) {
      params = params.set('minPrice', minPrice.toString());
    } else {
      params = params.set('minPrice', '0');
    }

    if (maxPrice !== null) {
      params = params.set('maxPrice', maxPrice.toString());
    } else {
      params = params.set('maxPrice', '0');
    }

    params = params.set('filterValue', filterValue.toString());

    return this.http.get<Class[]>(`${this.apiUrl}/filtered`, { params });
  }


}
