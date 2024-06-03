import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { client } from '../../model/client';
import { teacher } from '../../model/teacher';
import { UserRegisterComponent } from "../../components/user-register/user-register.component";
import { TeacherRegisterComponent } from "../../components/teacher-register/teacher-register.component";


@Component({
    selector: 'app-register',
    standalone: true,
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    imports: [RouterModule, FormsModule, CommonModule, UserRegisterComponent, TeacherRegisterComponent]
})

export class RegisterComponent implements OnInit {
[x: string]: any;
selectedRole: string = 'user'; // Variable para almacenar el rol seleccionado (user o teacher)

constructor() { }

ngOnInit(): void {
}
/**
 * Funcion para registrar un usuario o un profesor en el sistema 
 */
register(): void {
  console.log('Registrando...'); // Puedes agregar lógica general de registro aquí
}
  /**
   *  Funcion para registrar un usuario o un profesor en el sistema 
   * @param user  
   */

registerUser(user: any): void {
  // Lógica específica para el registro de usuario
 
  this.register(); 
}

registerTeacher(teacher: any): void {
  // Lógica específica para el registro de profesor
  
  this.register();
}
}
