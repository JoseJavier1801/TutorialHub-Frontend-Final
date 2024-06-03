import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Class } from '../../model/class';
import { CommonModule } from '@angular/common';
import { PetitionComponent } from '../petition/petition.component';
import { ClassExpansionComponent } from '../class-expansion/class-expansion.component';
import { MapService } from '../../service/map.service';
import { Router } from '@angular/router';
import { ClassService } from '../../service/class.service';
import { EditFormComponent } from '../edit-form/edit-form.component';
import { FormsModule } from '@angular/forms';
import { AssessmentService } from '../../service/assessment.service';

@Component({
  selector: 'app-class-card-component',
  standalone: true,
  imports: [CommonModule, ClassExpansionComponent, EditFormComponent, FormsModule,],
  templateUrl: './class-card-component.component.html',
  styleUrls: ['./class-card-component.component.css']
})
export class ClassCardComponentComponent implements OnInit {
  @Input() classData!: Class;
  isExpanded = false;// Variable para controlar si la tarjeta está expandida
  isProfileView = false;// Variable para controlar si la vista está en el perfil
  isEditing = false; // Variable para controlar si el formulario de edición está activo
  classId: number | undefined; // Variable para almacenar el ID de la clase
  state: number | undefined;
  teacherId: number | undefined;
  averageAssessment: number | undefined;
  videoUrl: string | undefined;
  isVideoModalOpen: boolean | undefined;
  constructor(private mapService: MapService, private router: Router, private classService: ClassService, private assessmentService: AssessmentService) { }
  /**
   * Método que se ejecuta cuando el componente se inicializa y controla si la vista está en el perfil o no y si la tarjeta está expandida o no en función de esto activa o desactiva el mapa
   *  - Si la vista está en el perfil, se activa el mapa y se agrega el marcador correspondiente a la ubicación de la clase en el mapa
   */
  ngOnInit(): void {
    this.isProfileView = this.router.url.includes('/profile');
    this.teacherId = this.classData?.teacherId;
    this.fetchAverageAssessment();
  }
  /**
   * Método que se ejecuta cuando se hace clic en el botón de eliminar, confirma la eliminación de la clase y muestra un mensaje de confirmación
   */
  confirmDelete(): void {
    if (this.isProfileView) {
      const isConfirmed = confirm('¿Estás seguro de que deseas eliminar esta clase?');
      if (isConfirmed) {
        this.deleteClass();
      }
    }
  }
  /**
   *  metodo que se ejecuta cuando se hace clic en el botón de editar, activa o desactiva el formulario de edición
   */
  expandCard(): void {
    if (!this.isEditing) {
     
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded && this.classData?.location) {

        const { lat, lng } = this.classData.location;
        if (lat !== undefined && lng !== undefined) {
          this.mapService.initializeMap(lat, lng);

          this.mapService.addCustomMarker(lat, lng);
        } else {
          console.error('Ubicación no válida:', this.classData.location);
        }
      } else {
        this.mapService.destroyMap();
      }
    }
  }
  /**
   * metodo que se ejecuta cuando se hace clic en el botón de eliminar de la tarjeta
   */

  deleteClass(): void {
    this.classService.deleteClass(this.classData.id).subscribe(() => {
      // Maneja la eliminación de la clase aquí
    }, error => {
      console.error('Error al eliminar la clase:', error);
    });
  }
  /**
   * funcion para cerrar el popup
   */
  closePopup(): void {
    this.isExpanded = false;
    this.mapService.destroyMap();
  }
  /**
   * funcion para activar o desactivar el formulario de edición
   */
  toggleEditForm(): void {
    this.isEditing = !this.isEditing;
    // Asigna el ID de la clase cuando se activa la edición
    if (this.isEditing) {
      this.classId = this.classData.id;
    } else {
      this.classId = undefined; // Reinicia el ID cuando se desactiva la edición
    }
  }
  playVideo() {
    if (this.classData.video) {
      this.videoUrl = 'data:video/mp4;base64,' + this.classData.video;
      this.isVideoModalOpen = true;
    } else {
      alert('Este video no está disponible.');
    }
  }
  closeVideoModal() {
    this.isVideoModalOpen = false;
  }
  fetchAverageAssessment(): void {
    if (this.classData && this.classData.teacher && this.classData.teacher.id) {
      const teacherId = this.classData.teacher.id;
     
      this.assessmentService.getAverageAssessmentByTeacherId(teacherId).subscribe(
        average => {
        
          this.averageAssessment = average;
        },
        error => {
          console.error('Error fetching average assessment:', error);
        }
      );
    } else {
      console.error('No se proporcionó información válida sobre el profesor.');
    }
  }

  /**
   * Función para obtener el arreglo de estrellas correspondiente al promedio de la evaluación
   * @returns Array con el número de estrellas, o un array vacío si no hay valoraciones
   */
  getStarArray(): number[] {
    if (!this.averageAssessment || this.averageAssessment === 0) return []; // Si no hay valoraciones, devuelve un array vacío
    const roundedRating = Math.round(this.averageAssessment); // Redondea el promedio al entero más cercano
    return Array.from({ length: roundedRating }, (_, index) => index + 1);
  }


  
}