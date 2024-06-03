import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../../page/login/login.component';
import { UserService } from '../../service/user.service';
import { TeacherService } from '../../service/teacher.service';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { EditTeacherProfileComponent } from '../edit-teacher-profile/edit-teacher-profile.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, EditProfileComponent, EditTeacherProfileComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})

export class SettingsComponent implements OnInit {
  showMenu: boolean = false;
  isTeacher: boolean = LoginComponent.isTeacher;
  userId: number | undefined;
  router: any;
  showEditProfile: boolean = false;
  showEditTeacherProfile: boolean = false;
  constructor(private userService: UserService, private teacherService: TeacherService) { }

  ngOnInit(): void {
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  deleteProfile(): void {
    if (confirm('¿Estás seguro de que deseas eliminar tu perfil?')) {
      if (LoginComponent.userId) {
        if (this.isTeacher) {
          this.teacherService.deleteTeacher(LoginComponent.userId).subscribe(() => {
            console.log('Profesor eliminado');
            // Redireccionar al usuario a la página de inicio después de eliminar el perfil
            this.router.navigate(['/home']);
          });
        } else {
          this.userService.deleteUser(LoginComponent.userId).subscribe(() => {
            console.log('Usuario eliminado');
            // Redireccionar al usuario a la página de inicio después de eliminar el perfil
            this.router.navigate(['/home']);
          });
        }
      } else {
        console.error('No se puede eliminar el perfil: userId es null.');
      }
    } else {
      console.log('Eliminación de perfil cancelada.');
    }
  }

  openEditProfile(): void {
    this.showEditProfile = true;
  }

  openEditTeacherProfile(): void {
    this.showEditTeacherProfile = true;
  }

  cancelEditProfile(): void {
    this.showEditProfile = false;
    this.showEditTeacherProfile = false;
  }

  closeEditTeacherProfile(): void {
    this.showEditTeacherProfile = false;
  }

  modifyProfile(): void {
    // Aquí puedes agregar la lógica para modificar el perfil
  }
  adjustBrightness(event: any) {
    const brightness = event.target.value;
    document.body.style.filter = `brightness(${brightness}%)`;
  }

}
