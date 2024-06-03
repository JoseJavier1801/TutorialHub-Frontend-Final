import { Injectable, PLATFORM_ID, Inject, NgZone, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Class } from '../model/class';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {

  private map: any;
  private mapSeeker: any;
  private mapInitialized = false;
  private initialLat: number | undefined;
  private initialLng: number | undefined;
  private markers: { [key: string]: any } = {};
  private mapPoint: any; // Agrega la propiedad mapPoint
  classService: any;
  private circle: any;
  classHighlightedSubject: Subject<number> = new Subject<number>();
  category: any;
  markerPositionEmitter: EventEmitter<{ latitude: number, longitude: number }> = new EventEmitter();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) { }
  /**
   *  Función para inicializar el mapa con la ubicación actual 
   * @param latitude 
   * @param longitude 
   * @returns devuelve una promesa que resuelve cuando el mapa se inicializa correctamente 
   */
  initializeMap(latitude: number, longitude: number): Promise<void> {
    return new Promise<void>((resolve) => {
      if (isPlatformBrowser(this.platformId)) {
        import('leaflet').then((L) => {
          if (!this.mapInitialized) {
            // Inicializar el mapa principal solo si no está inicializado
            this.map = L.map('map').setView([latitude, longitude], 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: 'OpenStreetMap',
            }).addTo(this.map);

            // Si el mapa principal se inicializa correctamente, establecer mapInitialized a true
            this.mapInitialized = true;
          } else {
            if (this.map) {
              // Verificar si this.map no es null antes de llamar a setView
              this.map.setView([latitude, longitude], 15);
            } else {
              console.error('El objeto de mapa es nulo.');
            }
          }
          resolve();
        }).catch((error) => {
          console.error('Error al cargar Leaflet:', error);
          resolve();
        });
      } else {
        console.error('No se puede inicializar el mapa en el servidor.');
        resolve();
      }
    });
  }


  /**
   *  Función para inicializar el mapa con la ubicación actual 
   * @returns  devuelve una promesa que resuelve cuando el mapa se inicializa correctamente
   */
  initializeMapSeekerWithCurrentLocation(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (isPlatformBrowser(this.platformId)) {
        import('leaflet').then((L) => {
          this.getCurrentLocation().then((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Inicializar el mapa mapSeeker y agregar un marcador en la ubicación actual
            this.mapSeeker = L.map('mapSeeker').setView([latitude, longitude], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: 'OpenStreetMap',
            }).addTo(this.mapSeeker);

            // Agregar marcador en la ubicación actual
            L.marker([latitude, longitude]).addTo(this.mapSeeker);

            resolve(); // Resolvemos la promesa una vez que el mapa se ha inicializado
          }).catch((error) => {
            console.error('Error al obtener la ubicación actual:', error);
            reject(error); // Rechazamos la promesa en caso de error
          });
        }).catch((error) => {
          console.error('Error al cargar Leaflet:', error);
          reject(error); // Rechazamos la promesa en caso de error
        });
      } else {
        reject('No se puede inicializar el mapa en este entorno.'); // Rechazamos la promesa si no estamos en un entorno de navegador
      }
    });
  }


  /**
   * Función para destruir el mapa 
   */
  destroyMap(): void {
    if (this.mapInitialized) {
      if (this.map) {
        this.map.remove();
        this.map = null;
      }
      this.mapInitialized = false;
    }
  }
  /**
   * Función para limpiar los marcadores
   */
  clearMarkers(): void {
    this.destroyMap();
    this.initializeMap(this.initialLat || 0, this.initialLng || 0);
    this.addCustomMarker(this.initialLat || 0, this.initialLng || 0);

    if (isPlatformBrowser(this.platformId) && this.mapPoint) {
      Object.values(this.markers).forEach(marker => marker.remove());
      this.markers = {};
    }
  }


  /**
   * funcion para agregar un marcador en el mapa 
   * @param latitude 
   * @param longitude 
   */
  addMarker(latitude: number, longitude: number): void {
    if (isPlatformBrowser(this.platformId) && this.map) {
      import('leaflet').then((L) => {
        L.marker([latitude, longitude]).addTo(this.map);
      });
    }
  }
  /**
   * Función para ajustar el tamaño del mapa para que se ajuste al tamaño de la pantalla
   */


  /**
   * funcion para saber si estamos en un entorno de navegador
   * @returns devuelve true si estamos en un entorno de navegador y false en caso contrario
   */
  isPlatformBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  /**
   * funcion para obtener la ubicación actual del usuario y agregar un marcador en el mapa 
   * @returns devuelve una promesa que resuelve cuando la ubicación se obtiene correctamente
   */
  getCurrentLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.isPlatformBrowser() && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject('Geolocation is not available in this environment.');
      }
    });
  }
  /**
   * funcion para agregar un marcador personalizado en el mapa 
   * @param latitude 
   * @param longitude 
   */

  addCustomMarker(latitude: number, longitude: number): void {
    if (isPlatformBrowser(this.platformId) && this.map) {
      import('leaflet').then((L) => {
        const customIcon = L.icon({
          iconUrl: '/assets/foto/geo.svg', // Ruta al icono personalizado
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        L.marker([latitude, longitude], { icon: customIcon }).addTo(this.map);
      });
    }
  }
  /**
   * funcion para configurar el mapa con la ubicación actual y agregar un marcador en el mapa 
   */


  /**
   *  Funcion para agregar marcadores para cada clase en el mapa seeker  
   * @param classes 
   */
  addMarkersForClasses(classes: Class[]): void {
    // Filtrar clases por categoría antes de agregar marcadores
    const filteredClasses = this.category ? classes.filter(cls => cls.category === this.category) : classes;

    if (isPlatformBrowser(this.platformId) && this.mapSeeker) {
      import('leaflet').then((L) => {
        // Limpiar marcadores existentes antes de agregar nuevos
        Object.values(this.markers).forEach(marker => marker.remove());
        this.markers = {};

        filteredClasses.forEach((cls) => {
          if (cls.location) {
            const marker = L.marker([cls.location.lat, cls.location.lng]).addTo(this.mapSeeker);
            marker.on('click', () => this.highlightClass(cls.id));
            this.markers[cls.id] = marker;
          }
        });
      });
    }
  }

  /**
   * funcion para resaltar la clase en el mapa seeker 
   * @param classId 
   */

  highlightClass(classId: number): void {
    // Resaltar la clase en el mapa seeker
    if (isPlatformBrowser(this.platformId) && this.mapSeeker) {
      import('leaflet').then((L) => {
        if (this.markers[classId]) {
          this.markers[classId].addTo(this.mapSeeker);
          // Agregar evento de clic al marcador para emitir el ID de la clase
          this.markers[classId].on('click', () => {
            this.classHighlightedSubject.next(classId);
            console.log(classId);
          });
        }
      });
    }
  }


  // Función para agregar un círculo al mapaaddCircle(): void {
  addCircle(): void {
    if (isPlatformBrowser(this.platformId) && this.mapSeeker) {
      this.getCurrentLocation().then((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        import('leaflet').then((L) => {
          const initialRadius = 500; // Radio inicial del círculo
          this.circle = L.circle([latitude, longitude], {
            color: '#0000FF',
            fillColor: '#0000FF',
            fillOpacity: 0.5,
            radius: initialRadius, // Establecer el radio inicial
          }).addTo(this.mapSeeker);

          // Agregar evento de clic al círculo
          this.circle.on('click', () => {
            // Aumentar el radio del círculo al hacer clic
            const currentRadius = this.circle.getRadius();
            const newRadius = currentRadius + 100; // Incremento arbitrario de 100 (puedes ajustarlo)
            this.circle.setRadius(newRadius);
          });
        });
      }).catch((error) => {
        console.error('Error al obtener la ubicación actual:', error);
      });
    }
  }


  getCircleCenterAndRadius(): { latitude: number, longitude: number, radius: number } {
    if (this.circle) {
      const center = this.circle.getLatLng(); // Obtener el centro del círculo
      const radius = this.circle.getRadius(); // Obtener el radio del círculo
      console.log(center, radius);
      return { latitude: center.lat, longitude: center.lng, radius };
    } else {
      return { latitude: 0, longitude: 0, radius: 0 }; // Devolver valores predeterminados si el círculo no está definido
    }
  }


  // Función para eliminar el círculo del mapa
  removeCircle(): void {
    if (this.circle) {
      this.circle.remove();
    }
  }
  initializeMapForPointSelection(): void {
    if (isPlatformBrowser(this.platformId)) {
      import('leaflet').then((L) => {
        this.mapPoint = L.map('mapPoint').setView([0, 0], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'OpenStreetMap',
        }).addTo(this.mapPoint);

        this.mapPoint.on('dblclick', (event: any) => {
          this.addMarkerPoint(event.latlng.lat, event.latlng.lng);
        });

        this.mapInitialized = true;
      }).catch((error) => {
        console.error('Error al cargar Leaflet:', error);
      });
    }
  }

  addMarkerPoint(latitude: number, longitude: number): void {
    if (isPlatformBrowser(this.platformId) && this.mapPoint) {
      import('leaflet').then((L) => {
        const marker = L.marker([latitude, longitude]).addTo(this.mapPoint);
        this.markers['selected'] = marker;

        // Emitir las coordenadas de la marca para que el componente pueda capturarlas
        this.markerPositionEmitter.emit({ latitude, longitude });
      });
    }
  }

  getSelectedLocation(): { lat: number; lng: number } | null {
    if (this.markers['selected']) {
      const latlng = this.markers['selected'].getLatLng();
      return { lat: latlng.lat, lng: latlng.lng };
    }
    return null;
  }



}