import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assessment } from '../../model/assessment';
import { AssessmentService } from '../../service/assessment.service';
import { LoginComponent } from '../../page/login/login.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {

  @Input() teacherId!: number;
  rating: number | undefined;
  comment: string = '';
  errorMessage: string = ''; 
  successMessage: string = '';
  constructor(private assessmentService: AssessmentService) { }
/**
 *  Funcion para establecer el assessment rating
 * @param stars 
 */
  setRating(stars: number): void {
    this.rating = stars;
  }
/**
 *  Funcion para enviar la valoración a la base de datos
 * @returns 
 */
  submitForm(): void {
    // Verificar si teacherId y clientId son iguales
    if (this.teacherId === LoginComponent.userId) {
      this.errorMessage = 'No puedes enviar una valoración para tu propia clase.';
      return; // Salir del método si hay un error
    }

    const assessment: Assessment = {
      id: 0,
      teacherId: this.teacherId || 0,  // Si teacherId no está definido, establecerlo como 0
      comment: this.comment,
      assessment: this.rating || 0,  // Si rating no está definido, establecerlo como 0
      clientId: LoginComponent.isTeacher ? LoginComponent.userId! : LoginComponent.userId!,
       // Asignar el mismo ID como clientId si es un profesor
    };

    console.log('Datos a enviar:', assessment);

    this.assessmentService.createAssessment(assessment).subscribe(
      response => {
     
        this.successMessage = '¡La valoración ha sido enviada con éxito!';
        // Limpiar el mensaje después de unos segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
    
      error => {
        console.error('Error al enviar la valoración:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario.
      }
    );
  }

}