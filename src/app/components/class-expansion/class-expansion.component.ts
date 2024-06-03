import { Component, Input, AfterContentInit, OnDestroy, Output, EventEmitter, ElementRef } from '@angular/core';
import { MapService } from '../../service/map.service';
import { Class } from '../../model/class';
import { CommonModule } from '@angular/common';
import { PetitionComponent } from '../petition/petition.component';
import { TeacherProfileComponent } from '../teacher-profile/teacher-profile.component';
import { PetitionService } from '../../service/petition.service';
import { LoginComponent } from '../../page/login/login.component';
import { RatingComponent } from '../rating/rating.component';
import { AssessmentTeacherComponent } from '../assessment-teacher/assessment-teacher.component';
import { AssessmentService } from '../../service/assessment.service';
import { Assessment } from '../../model/assessment'; // Importa el modelo de evaluación

@Component({
  selector: 'app-class-expansion',
  standalone: true,
  imports: [CommonModule, PetitionComponent, TeacherProfileComponent, RatingComponent, AssessmentTeacherComponent],
  templateUrl: './class-expansion.component.html',
  styleUrls: ['./class-expansion.component.css']
})
export class ClassExpansionComponent implements AfterContentInit, OnDestroy {
  @Input() classData!: Class;
  @Output() closePopupEvent = new EventEmitter<void>();
  teacherId: number | undefined;
  assessments: any[] = [];

  constructor(private mapService: MapService, private el: ElementRef, private petitionService: PetitionService, private assessmentService: AssessmentService) { }
/**
 * Funcion para obtener el id del teacher
 */
  ngAfterContentInit(): void {
    this.setupMap();
    this.getTeacherId();
  }
/**
 * Funcion para destruir el mapa cuando se destruye el componente
 */
  ngOnDestroy(): void {
    if (this.mapService) {
      this.mapService.destroyMap();
    }
  }
  /**
   * Funcion para cerrar el popup
   */

  closePopup(): void {
    this.closePopupEvent.emit();
    this.mapService.destroyMap();
  }
/**
 *  Funcion para cortar el texto si es mayor a maxChars 
 * @param text  
 * @param maxChars 
 * @returns  
 */
  truncateText(text: string, maxChars: number): string {
    return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
  }
/**
 * Funcion para enviar la petición 
 */
  sendPetition(): void {
    if (this.classData && LoginComponent.userId) {
      const message = 'Mensaje de la petición';
      const state = 'Estado de la petición';
      const date = new Date();

      this.petitionService.addPetition(
        this.classData.id,
        LoginComponent.userId,
        message,
        state,
        date
      ).subscribe(
        (response) => {
         
        },
        (error) => {
          console.error('Error sending petition:', error);
        }
      );
    } else {
      console.error('Class data or user ID undefined.');
    }
  }
/**
 * Funcion para inicializar el mapa y agregar un marcador en la ubicación de la clase
 */
  private setupMap(): void {

    if (this.classData && this.classData.location && typeof this.classData.location.lat === 'number' && typeof this.classData.location.lng === 'number') {
      const latitude = this.classData.location.lat;

      const longitude = this.classData.location.lng;

      this.mapService.initializeMap(latitude, longitude).then(() => {
        // Agregar un marcador en la ubicación de la clase
        this.mapService.addMarker(latitude, longitude);
      });
    } else {
      console.error('No se proporcionaron coordenadas válidas para la ubicación de la clase.');
    }
  }


/**
 * Funcion para obtener el id del teacher y obtener las evaluaciones correspondientes
 */

  private getTeacherId(): void {
    if (this.classData && this.classData.teacher && this.classData.teacher.id) {
      // Llama al servicio para obtener las evaluaciones del profesor
      this.assessmentService.getAssessmentsByTeacherId(this.classData.teacher.id).subscribe(
        (assessments) => {
          // Verificar si se recibieron evaluaciones
          if (assessments && assessments.length > 0) {
            // Asignar las evaluaciones a la propiedad assessments
            this.assessments = assessments;
            // Obtener el teacherId de la primera evaluación en el array
            const firstAssessment = assessments[0];
            if (firstAssessment && firstAssessment.teacherId) {
              this.teacherId = firstAssessment.teacherId;
            } else {
              console.error('No se encontró el ID del profesor en la primera evaluación.');
            }
          } else {
            console.error('No se encontraron evaluaciones para el profesor.');
          }
        },
        (error) => {
          console.error('Error al obtener las evaluaciones:', error);
        }
      );
    } else {
      console.error('No se proporcionó información válida sobre el profesor.');
    }
  }
}