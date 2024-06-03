import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { teacher } from '../../model/teacher';
import { TeacherService } from '../../service/teacher.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-teacher-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-teacher-profile.component.html',
  styleUrl: './edit-teacher-profile.component.css'
})
export class EditTeacherProfileComponent implements OnInit {

  @Input() teacherData: teacher | undefined;
  @Output() updateTeacherEvent = new EventEmitter<void>();
  @Output() closeEditEvent = new EventEmitter<void>(); // Aquí se inicializa el EventEmitter

  public form: FormGroup;
  private selectedPhoto: string | undefined;
  errorMessage: string | undefined;
  loggedInUserId: number | undefined;

  constructor(private formBuilder: FormBuilder, private router: Router, private teacherService: TeacherService, private userService: UserService) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      username: ['', Validators.required],
      mail: ['', Validators.email],
      phone: [''],
      password: ['', Validators.required],
      date: [''],
      title: [''],
      biography: [''],
      photo: ['']
    });
  }

  ngOnInit(): void {
    if (this.teacherData) {
      // Inicializar campos con datos del profesor
      this.form.patchValue({
        name: this.teacherData.name,
        username: this.teacherData.username,
        mail: this.teacherData.mail,
        phone: this.teacherData.phone,
        password: this.teacherData.password,
        date: this.teacherData.date,
        title: this.teacherData.title,
        biography: this.teacherData.biography,
        photo: this.teacherData.photo
      });
    }
  }



  updateTeacher(): void {
    const updateTeacher: Partial<teacher> = this.form.value;
    const updateTeacherwithPhoto = { ...updateTeacher, photo: this.selectedPhoto };
    updateTeacher.id = this.loggedInUserId; // Utiliza el ID del usuario logueado

    if (this.loggedInUserId) {
      this.teacherService.modifyTeacher(this.loggedInUserId, updateTeacherwithPhoto as teacher)
        .subscribe(() => {
          // Actualización exitosa
          this.updateTeacherEvent.emit();
          this.router.navigate(['/home']);
        }, (error: any) => {
          // Manejar errores y mostrar mensaje
          console.error('Error al actualizar el profesor:', error);
          this.errorMessage = 'Error al actualizar el profesor. Por favor, inténtelo de nuevo.';
        });
    }
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
  closeForm(): void {
    this.closeEditEvent.emit();
  }
}