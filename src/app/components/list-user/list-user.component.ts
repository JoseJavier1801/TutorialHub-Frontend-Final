import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { client } from '../../model/client';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../../page/login/login.component';
import { HomeworkService } from '../../service/homework.service';
import { homework } from '../../model/homework';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent {
  @Input() clientsData: any[] = [];

  uploadMessage: string | undefined;
  isModalVisible: boolean = false;
  selectedClientId: number | null = null;
  comment: string = '';
  selectedFile: File | null = null;
  teacherId: string = '';

  constructor(private homeworkService: HomeworkService) { }

  get clients(): client[] {
    return this.clientsData.map(clientData => ({
      id: clientData[5],  // Corrigiendo la posición del ID en la matriz
      username: clientData.username,
      name: clientData[0],
      mail: clientData[2],
      phone: clientData[3],
      date: clientData[4],
      password: clientData[5],
      photo: `data:image/png;base64,${clientData[1]}`,
      photoBase64: ''
    }));
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      
    }
  }

  showModal(clientId: number) {
    this.selectedClientId = clientId; // Toma el ID del cliente proporcionado
    this.teacherId = LoginComponent.userId !== null ? LoginComponent.userId.toString() : '';
    this.isModalVisible = true;
   
  }

  closeModal() {
    this.isModalVisible = false;
    this.comment = '';
    this.selectedFile = null;
  }

  completeUpload() {
    if (this.selectedFile && this.selectedClientId !== null && this.teacherId) {
     

      // Convertir el archivo a una cadena base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result?.toString() || '';
        const cleanedBase64Data = base64Data.split(',')[1]; // Eliminar la parte MIME

        if (this.selectedClientId !== null) {  // Asegurarse de que selectedClientId no sea null
          const homeworkData: homework = {
            clientId: this.selectedClientId, // Utiliza el ID del cliente almacenado en selectedClientId
            teacherId: parseInt(this.teacherId),
            archive: cleanedBase64Data,
            datetime: new Date(),
            description: this.comment,
            id: 0
          };

          this.homeworkService.createHomework(homeworkData).subscribe(
            response => {
              console.log('Homework created successfully:', response);
              this.uploadMessage = 'Archivo subido con éxito.';
              this.closeModal();
            },
            error => {
              console.error('Error creating homework:', error);
              this.uploadMessage = 'Error al subir el archivo. Por favor, intenta de nuevo.';
            }
          );
        } else {
          console.error('Client ID is null.');
        }
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.uploadMessage = 'Por favor, selecciona un archivo y añade un comentario.';
    }
  }
}
