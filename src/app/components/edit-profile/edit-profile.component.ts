import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Camera, CameraResultType } from '@capacitor/camera';
import { client } from '../../model/client';
import { UserService } from '../../service/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginComponent } from '../../page/login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  @Input() userData: client | undefined;
  @Output() cancelEditEvent = new EventEmitter<void>();
  @Output() updateUserEvent = new EventEmitter<void>();

  public form: FormGroup;
  private selectedPhoto: string | undefined;
  errorMessage: string | undefined;
  loggedInUserId: number | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
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

  ngOnInit(): void {
    if (LoginComponent.userId !== null) {
      this.loggedInUserId = LoginComponent.userId;
    }
    // Asigna el valor de userId a loggedInUserId
    if (this.userData) {
      this.form.patchValue({
        name: this.userData.name,
        username: this.userData.username,
        mail: this.userData.mail,
        phone: this.userData.phone,
        password: this.userData.password,
        date: this.userData.date,
        photo: this.userData.photo
      });
    }
  }

  updateUser(): void {
    const updateUser: Partial<client> = this.form.value;
    const updateUserwithPhoto = { ...updateUser, photo: this.selectedPhoto };
    updateUser.id = this.loggedInUserId; // Utiliza el ID del usuario logueado

    if (this.loggedInUserId) {
      this.userService.updateUser(this.loggedInUserId, updateUserwithPhoto as client)
        .subscribe(() => {
          // Actualización exitosa
          this.updateUserEvent.emit();
          this.router.navigate(['/home']);
          this.errorMessage = ''; // Limpiar mensaje de error
        }, (error: any) => {
          // Manejar errores y mostrar mensaje
          console.error('Error al actualizar el usuario:', error);
          this.errorMessage = 'Error al actualizar el usuario. Por favor, inténtelo de nuevo.';
        });
    }
  }


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

  closeForm(): void {
    this.cancelEditEvent.emit();
  }
}