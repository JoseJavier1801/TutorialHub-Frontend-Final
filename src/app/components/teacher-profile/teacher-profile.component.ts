import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { teacher } from '../../model/teacher';
import { TeacherService } from '../../service/teacher.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../../page/login/login.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-teacher-profile',
  standalone: true,
  imports: [CommonModule, RouterModule,SettingsComponent],
  styleUrls: ['./teacher-profile.component.css'],
  templateUrl: './teacher-profile.component.html',
})
export class TeacherProfileComponent implements OnInit, OnDestroy {
  teacherData: teacher | null = null;
  private teacherProfileUpdatedSubscription: Subscription;

  constructor(private teacherService: TeacherService) {
    this.teacherProfileUpdatedSubscription = this.teacherService.teacherProfileUpdatedSubject.subscribe(
      (updatedTeacher: teacher | null) => {
        if (updatedTeacher) {
          this.teacherData = { ...updatedTeacher };
        }
      }
    );
  }

  ngOnInit(): void {
    // Obtener el ID del profesor desde el LoginComponent
    const teacherId = LoginComponent.userId;
    if (teacherId) {
      this.loadTeacherData(teacherId);
    }
  }
  /**
   * Funcion para cerrar el popup 
   */

  ngOnDestroy(): void {
    this.teacherProfileUpdatedSubscription.unsubscribe();
  }
  /**
   *  Funcion para cargar los datos del profesor con el ID especificado
   * @param teacherId 
   */

  loadTeacherData(teacherId: number): void {
    this.teacherService.getTeacherById(teacherId).subscribe((teacher) => {
      if (teacher) {
       
        this.teacherData = teacher;
      } else {
        console.error('No se encontró el profesor con el ID especificado.');
      }
    });
  }
/**
 *  Funcion para obtener la imagen del perfil del profesor 
 * @returns  imagen del perfil del profesor
 */
  getProfileImage(): string | undefined {
    // Asumiendo que teacherData.photo contiene la cadena Base64 de la imagen
    return `data:image/jpeg;base64, ${this.teacherData?.photo}`; // Ajusta el tipo de imagen según sea necesario
  }
}