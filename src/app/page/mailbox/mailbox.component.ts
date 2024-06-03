import { Component, OnInit } from '@angular/core';
import { PetitionListComponent } from '../../components/petition-list/petition-list.component';
import { CommonModule } from '@angular/common';
import { Petition } from '../../model/petition';
import { PetitionService } from '../../service/petition.service';
import { PetitionComponent } from '../../components/petition/petition.component';
import { LoginComponent } from '../login/login.component';


@Component({
  selector: 'app-mailbox',
  standalone: true,
  imports: [PetitionListComponent, CommonModule, PetitionComponent],
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.css']
})
export class MailboxComponent implements OnInit {
  petitions: Petition[] = [];
  valorPetition: 0 | undefined;
  statePetition: string = 'Pendiente'; // Inicializar con el valor predeterminado
  isTeacher: boolean = LoginComponent.isTeacher;
  constructor(private petitionService: PetitionService) { }

  ngOnInit(): void {
    this.loadPetitions(); // Cargar las peticiones al inicializar el componente
  }

  // Función para filtrar las peticiones por estado
  filterByStatus(status: string): void {
    this.statePetition = status; // Actualizar el valor de statePetition
    this.loadPetitions(); // Recargar las peticiones con el nuevo estado
  }

  // Variable para almacenar el estado actual de los filtros
  currentStatusFilter: string = 'all'; // Puedes establecer 'all', 'accepted', 'denied' o 'pending'

  // Función para cargar las peticiones según el estado actual
  loadPetitions(): void {
    const userId = LoginComponent.userId;
    const isTeacher = LoginComponent.isTeacher;

    if (userId !== null) {
      let petitionObservable;

      if (isTeacher) {
        petitionObservable = this.petitionService.getPetitionsByTeacher(userId, this.statePetition);
      } else {
        petitionObservable = this.petitionService.getPetitionsByClientId(userId, this.statePetition);
      }

      petitionObservable.subscribe((petitions: Petition[] | null) => {
        if (petitions !== null) {
          // Verificar si petitions no es null antes de iterar sobre él
          if (Array.isArray(petitions)) { // Verificar si petitions es un arreglo
            petitions.forEach(petition => {
              if (petition.photo) {
                if (typeof petition.photo === 'string') {
                  petition.photoBase64 = petition.photo;
                } else {
                  petition.photoBase64 = this.arrayBufferToBase64(petition.photo);
                }
              }
            });
            this.petitions = petitions;
          } else {
            this.petitions = []; // Si las peticiones no son un arreglo, asignar un arreglo vacío
          }
        } else {
          this.petitions = []; // Si las peticiones son nulas, asignar un arreglo vacío
        }
      });
    }
  }

  arrayBufferToBase64(photo: never): string {
    throw new Error('Method not implemented.');
  }

}
