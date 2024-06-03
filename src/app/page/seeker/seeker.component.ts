import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapService } from '../../service/map.service';
import { ClassCardComponentComponent } from '../../components/class-card-component/class-card-component.component';
import { CommonModule } from '@angular/common';
import { ClassFormComponent } from '../../components/class-form/class-form.component';
import { PetitionComponent } from '../../components/petition/petition.component';
import { ClassService } from '../../service/class.service';
import { Class } from '../../model/class';
import { finalize, map, mergeMap, toArray } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { ClassExpansionComponent } from '../../components/class-expansion/class-expansion.component';

@Component({
  selector: 'app-seeker',
  standalone: true,
  imports: [ClassFormComponent, CommonModule, ClassCardComponentComponent, ClassExpansionComponent],
  templateUrl: './seeker.component.html',
  styleUrls: ['./seeker.component.css'],
})
export class SeekerComponent implements OnInit {

  classes: Class[] = [];
  filteredClasses: Class[] = [];
  isCircleActive: boolean = false;
  classHighlightedSubscription: any;
  highlightedClassId: number | undefined;
  selectedClass: Class | undefined;
  isExpanded: boolean | undefined;
  showSearchResults: boolean = false;
  showCircleResults: boolean = false;

  constructor(private classService: ClassService, private mapService: MapService) { }

  
/**
 * Funcion para cargar las clases y mostrarlas en el componente 
 */
  ngOnInit(): void {
   
    this.activateMap();
    // Suscribirse al Subject para recibir el ID de la clase resaltada
    this.classHighlightedSubscription = this.mapService.classHighlightedSubject.subscribe(
      (classId: number) => {
        this.highlightedClassId = classId;
        // Almacenar el ID de la clase resaltada
        this.onClassLocationIconClick(classId); // Obtener detalles de la clase resaltada
      }
    );
  }
/**
 * Funcion para destruir el componente y desuscribirse al Subject para evitar fugas de memoria 
 */
  ngOnDestroy(): void {
    // Desuscribirse al destruir el componente para evitar fugas de memoria
    if (this.classHighlightedSubscription) {
      this.classHighlightedSubscription.unsubscribe();
    }
  }
/**
 *  Funcion para resaltar la clase y mostrar sus detalles 
 * @param classId 
 */
  onClassLocationIconClick(classId: number): void {
    this.highlightedClassId = classId; // Guardar la id de la clase resaltada

    // Filtrar la lista de clases para mostrar solo la clase correspondiente al ID resaltado
    if (this.highlightedClassId) {
      this.selectedClass = this.classes.find(cls => cls.id === this.highlightedClassId);
    }
  }


  /**
   *  Funcion para buscar clases por categoria, localidad y codigo postal 
   * @param event 
   */

  searchClasses(event: Event): void {
    event.preventDefault();

    const category = (document.getElementById('categoria') as HTMLSelectElement).value || 'No rellenado';
    

    this.classService.searchClassrooms(category).pipe(
      mergeMap((details: any) => Object.values(details)),
      map((detail: any) => ({
        id: +detail.id,
        teacherId: +detail.teacherId,
        description: detail.description,
        type: detail.type,
        category: detail.category,
        location: { lat: +detail.lat, lng: +detail.lng },
        direction: detail.direction,
        postalCode: detail.postalCode,
        province: detail.province,
        duration: detail.duration,
        localidad: detail.localidad,
        photo: detail.photo,
        teacher: detail.teacher,
        price: detail.price,
        video:detail.video
      })),
      toArray()
    ).subscribe(
      (classes: Class[]) => {
        this.classes = classes;
        // Llama al método para agregar marcadores en el mapa para cada clase encontrada
        this.mapService.addMarkersForClasses(this.classes);
        this.showSearchResults = true;
        this.showCircleResults = false;
      },
      (error) => {
        console.error('Error al buscar clases:', error);
      }
    );
  }
  /**
   * Funcion para activar el mapa 
   */
  activateMap(): void {
    this.mapService.initializeMapSeekerWithCurrentLocation(); // Llama al método setupMap() de MapService y pasa el ID del contenedor del mapa
  }
/**
 * Funcion para obtener la ubicación actual del usuario y agregar un marcador en el mapa 
 */
   getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          // Configurar solo el mapa mapSeeker con la ubicación actual
          this.mapService.initializeMap(userLocation.lat, userLocation.lng).then(() => {
            // Agregar un marcador en el mapa mapSeeker
            this.mapService.addMarker(userLocation.lat, userLocation.lng);
          });
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
        }
      );
    } else {
      console.error('Geolocalización no soportada por este navegador.');
    }
  }

  /**
   * Funcion para activar o desactivar el círculo 
   */
  toggleCircle(event: Event): void {
    event.preventDefault();
    this.isCircleActive = !this.isCircleActive;
    this.showSearchResults = false;
    this.showCircleResults = true;

    if (this.isCircleActive) {
      this.mapService.addCircle();
      const circleInfo = this.mapService.getCircleCenterAndRadius();
      this.classService.getClassesByPoint(
        circleInfo.latitude.toString(),
        circleInfo.longitude.toString(),
        circleInfo.radius
      ).pipe(
        mergeMap((details: any) => Object.values(details)),
        map((detail: any) => ({
          id: +detail.id,
          teacherId: +detail.teacherId,
          description: detail.description,
          type: detail.type,
          category: detail.category,
          location: { lat: +detail.lat, lng: +detail.lng },
          direction: detail.direction,
          postalCode: detail.postalCode,
          province: detail.province,
          duration: detail.duration,
          localidad: detail.localidad,
          photo: detail.photo,
          phone: detail.phone,
          teacher: detail.teacher,
          price: detail.price,
          video: detail.video
        })),
        toArray()
      ).subscribe(
        (classes: Class[]) => {
          this.filteredClasses = classes; // Almacenar las clases filtradas por el círculo
          console.log("Iniciado poner la ubicacion");
          this.mapService.addMarkersForClasses(this.filteredClasses); // Usar this.filteredClasses en lugar de this.classes
        },
        (error) => {
          console.error('Error al obtener las clases por punto:', error);
        }
      );
    } else {
      this.mapService.removeCircle();
    }
  }





  /**
   * Funcion para cerrar el popup 
   */
  closePopup(): void {
    this.selectedClass = undefined;
  }


}