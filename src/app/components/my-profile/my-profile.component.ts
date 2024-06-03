import { Component, Input, OnInit } from '@angular/core';
import { client } from '../../model/client';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { LoginComponent } from '../../page/login/login.component';
import { SeekerComponent } from '../../page/seeker/seeker.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule,SettingsComponent],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  currentUser: client | null = null;

  constructor(private userService: UserService) { }
/**
 * Funcion para cargar el usuario actual y mostrar los datos en el componente 
 */
  ngOnInit(): void {
    this.loadCurrentUser();
  }
/**
 * Funcion para cargar el usuario actual y mostrar los datos en el componente 
 */
  async loadCurrentUser() {
    try {
      const userId = LoginComponent.userId; // Obtener directamente el ID almacenado en la variable estática
      if (userId) {
        const user = await this.userService.getUserById().toPromise(); // Obtener los datos del usuario actual sin pasar ningún argumento
        if (user) {
          this.currentUser = user;
        } else {
          console.error('El usuario no está autenticado o no se encontró');
        }
      } else {
        console.error('No se proporcionó un ID de usuario válido.');
      }
    } catch (error) {
      console.error('Error al cargar el usuario actual:', error);
    }
  }
/**
 *  Funcion para obtener la URL de la imagen de perfil del usuario actual
 * @returns la URL de la imagen de perfil del usuario actual
 */
  getProfileImage(): string {
    // Verificar si currentUser tiene la propiedad photo
    if (this.currentUser && this.currentUser.photo) {
      // Convertir la cadena base64 en una URL de imagen válida
      return 'data:image/jpeg;base64,' + this.currentUser.photo;
    } else {
      // Si no hay foto, devolver una URL de imagen predeterminada o una cadena vacía
      return ''; // O podrías devolver una URL de imagen predeterminada si lo deseas
    }
  }
}