import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { teacher } from '../../model/teacher';
import { TeacherService } from '../../service/teacher.service';
import { CommonModule } from '@angular/common';
import { TeacherProfileComponent } from '../teacher-profile/teacher-profile.component';
import { UserService } from '../../service/user.service';
import { client } from '../../model/client';

@Component({
  selector: 'app-teacher-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,TeacherProfileComponent,CommonModule],
  templateUrl: './teacher-register.component.html',
  styleUrls: ['./teacher-register.component.css']
})
export class TeacherRegisterComponent {
  @Output() teacherRegistered = new EventEmitter<any>();

  public form: FormGroup;
  private selectedPhoto: string | undefined;
  errorMessage: string | undefined;

  constructor(private formBuilder: FormBuilder, private teacherService: TeacherService ,private userService: UserService) {
    this.form = this.formBuilder.group({
      photo: [''],
      name: ['', [Validators.required, Validators.minLength(4)]],
      username: ['', Validators.required],
      mail: ['', Validators.email],
      password: ['', Validators.required],
      date: [new Date()],
      phone: [''],
      title: [''],
      biography: [''],
    });
  }



/**
 *  Funcion para convertir un Blob en una cadena de texto en base64
 * @param blob 
 * @returns devuelve una cadena de texto
 */
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
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
        resultType: CameraResultType.Base64, // Change resultType to Base64
      });

      if (image.base64String) { // Check if base64String is available
        this.selectedPhoto = image.base64String;
      } else {
        console.error('La propiedad base64String de la imagen es undefined.');
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }
  /**
   * Funcion para registrar al profesor con los datos del formulario y la imagen seleccionada o predeterminada 
   */

  public registerTeacher(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      const teacherDataWithPhoto = { ...formData, photo: this.selectedPhoto };

      // Verificar si el nombre de usuario y el correo electrónico ya existen antes de guardar al profesor
      this.userService.existsByUsernameOrEmail(formData.username, formData.mail).subscribe(
        (existingClient: client | null) => {
          if (existingClient) {
            this.errorMessage = 'Ya existe un profesor con el mismo nombre de usuario o correo electrónico.';
            setTimeout(() => {
              this.errorMessage = ''; // Limpiar el mensaje después de 20 segundos
            }, 20000); // 20 segundos en milisegundos
          } else {
            // Si no existe un profesor con el mismo nombre de usuario o correo electrónico, guardar al profesor
            this.teacherService.saveTeacher(teacherDataWithPhoto).subscribe(
              (savedTeacher: teacher | null) => {
                if (savedTeacher) {
              
                  this.teacherRegistered.emit({ teacherData: savedTeacher, teacherId: savedTeacher.id });
                  this.showSuccessToast();
                } else {
                  this.errorMessage = 'Error al registrar el profesor.';
                  setTimeout(() => {
                    this.errorMessage = ''; // Limpiar el mensaje después de 20 segundos
                  }, 20000); // 20 segundos en milisegundos
                }
              },
              (error) => {
                this.errorMessage = 'Error al registrar el profesor: ' + error;
                setTimeout(() => {
                  this.errorMessage = ''; // Limpiar el mensaje después de 20 segundos
                }, 20000); // 20 segundos en milisegundos
              }
            );
          }
        },
        (error) => {
          this.errorMessage = 'Error al verificar la existencia de nombre de usuario y correo electrónico: ' + error;
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
 * Funcion para mostrar un mensaje de exito al registrar al profesor y cerrar el popup 
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