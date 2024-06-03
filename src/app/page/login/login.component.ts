import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../service/teacher.service';
import { tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import * as bcrypt from 'bcryptjs'; // Importar bcryptjs
import { client } from '../../model/client';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  static isTeacher: boolean = false;
  username: string = '';
  password: string = '';
  static userId: number | null = null;

  errorMessage: string | null = null; // Variable para almacenar el mensaje de error

  constructor(private userService: UserService, private teacherService: TeacherService, private router: Router) { }
/**
 *  Funcion para iniciar sesion como cliente o como profesor con el nombre de usuario y la contraseña ingresadas por el usuario 
 * @returns  true si el inicio de sesión fue exitoso, false en caso contrario
 */
  async iniciarSesion() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, ingrese un nombre de usuario y una contraseña.';
      return;
    }

    const isSuccessfulTeacher = await this.teacherService.loginTeacherWithUsernameAndPassword(this.username, this.password).toPromise();
    if (isSuccessfulTeacher) {
      LoginComponent.userId = isSuccessfulTeacher.id;
      this.loginSuccess.emit();
      this.router.navigate(['/profile']);
      LoginComponent.isTeacher = true;
      return;
    }
   

    const isSuccessfulClient = await this.userService.loginClientWithUsernameAndPassword(this.username, this.password).toPromise();
    if (isSuccessfulClient) {
      LoginComponent.userId = isSuccessfulClient.id;
      this.loginSuccess.emit();
      this.router.navigate(['/class']);
      LoginComponent.isTeacher = false;
      return;
    }

    // Si no se pudo iniciar sesión ni como cliente ni como profesor, mostrar mensaje de error
    this.errorMessage = 'Usuario o contraseña incorrectos.';
  }
}