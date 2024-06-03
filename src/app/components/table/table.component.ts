import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeworkService } from '../../service/homework.service';
import { homework } from '../../model/homework';
import { Console } from 'console';
import { LoginComponent } from '../../page/login/login.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']  // Cambiar de styleUrl a styleUrls
})
export class TableComponent implements OnInit {
  homeworks: homework[] = [];
  clientId: number = LoginComponent.userId || 0;  // Asigna el clientId que necesitas o un valor predeterminado en caso de que sea null

  constructor(private homeworkService: HomeworkService) { }

  ngOnInit(): void {
    this.loadHomeworkDetails();
  }

  loadHomeworkDetails(): void {
    console.log(this.clientId);
    this.homeworkService.getHomeworkDetailsByClientId(this.clientId).subscribe(

      (data: homework[]) => {
        this.homeworks = data;
      },
      error => {
        console.error('Error fetching homework details:', error);
      }
    );
  }

  downloadFile(data: any, filename: string): void {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'archivo.bin';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  // Componente
  downloadHomework(id: number, description: string) {
    this.homeworkService.downloadHomework(id).subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' }); // Cambia el tipo MIME según tu archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${description}.pdf`; // Nombre del archivo de descarga
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.error('Error downloading file:', error);
    });
  }


}
