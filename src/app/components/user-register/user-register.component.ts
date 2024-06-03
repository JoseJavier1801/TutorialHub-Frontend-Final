import { Component, ElementRef, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { client } from '../../model/client';
import { UserService } from '../../service/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MyProfileComponent } from '../my-profile/my-profile.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MyProfileComponent, CommonModule],
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent {
  @Output() userRegistered = new EventEmitter<client>();
  public form: FormGroup;
  private selectedPhoto: string | undefined;
  errorMessage: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.form = this.formBuilder.group({
      photo: [''],
      name: ['', [Validators.required, Validators.minLength(4)]],
      username: ['', Validators.required],
      mail: ['', Validators.email],
      password: ['', Validators.required],
      phone: [''],
      date: ['']
    });
  }
/**
 * Funcion para tomar una foto y convertirla en una cadena de texto 
 */
  public async takePic(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });

      if (image.base64String) {
        this.selectedPhoto = image.base64String;
      } else {
        console.error('La propiedad base64String de la imagen es undefined.');
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }
  /**
   * Funcion para registrar un usuario y mostrar un mensaje de exito o de error dependiendo de la respuesta del servidor 
   */

  public registerUser(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      const userDataWithPhoto = { ...formData, photo: this.selectedPhoto };

      // Verificar si ya existe un cliente con el mismo nombre de usuario o correo electrónico
      this.userService.existsByUsernameOrEmail(formData.username, formData.mail).subscribe(
        (existingClient: client | null) => {
          if (existingClient) {
            this.errorMessage = 'Ya existe un cliente con el mismo nombre de usuario o correo electrónico.';
            setTimeout(() => {
              this.errorMessage = ''; // Limpiar el mensaje después de 20 segundos
            }, 20000); // 20 segundos en milisegundos
          } else {
            // No hay cliente existente, continuar con el registro del usuario
            this.userService.saveUser(userDataWithPhoto).subscribe(
              (savedUser: client | null) => {
                if (savedUser) {
                 
                  this.userRegistered.emit(savedUser);
                  this.showSuccessToast();
                } else {
                  this.errorMessage = 'Error al registrar el usuario.';
                  setTimeout(() => {
                    this.errorMessage = ''; // Limpiar el mensaje después de 20 segundos
                  }, 20000); // 20 segundos en milisegundos
                }
              },
              (error) => {
                this.errorMessage = 'Error al registrar el usuario: ' + error;
                setTimeout(() => {
                  this.errorMessage = ''; // Limpiar el mensaje después de 20 segundos
                }, 20000); // 20 segundos en milisegundos
              }
            );
          }
        },
        (error) => {
          console.error('Error al verificar la existencia de usuario:', error);
          this.errorMessage = 'Error al verificar la existencia de usuario.';
          setTimeout(() => {
            this.errorMessage = ''; // Limpiar el mensaje después de 20 segundos
          }, 20000); // 20 segundos en milisegundos
        }
      );
    } else {
      this.errorMessage = 'Todos los campos obligatorios deben completarse correctamente.';
    }
  }
/**
 * Funcion para mostrar un mensaje de exito al registrar un usuario y cerrar el popup 
 */
  private showSuccessToast(): void {
    const toast = document.getElementById('successToast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }
}