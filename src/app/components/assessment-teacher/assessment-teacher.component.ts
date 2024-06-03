import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assessment-teacher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assessment-teacher.component.html',
  styleUrls: ['./assessment-teacher.component.css']
})
export class AssessmentTeacherComponent {
  @Input() teacherId: number | undefined;
  @Input() assessments: any[] = [];

  /**
   *  funcion para obtener el arreglo de estrellas correspondiente al rating del assessment 
   * @param assessmentRating  
   * @returns 
   */
  getStarArray(assessmentRating: number): number[] {
    return Array.from({ length: assessmentRating }, (_, index) => index + 1);
  }
}
