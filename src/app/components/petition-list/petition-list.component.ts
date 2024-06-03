import { Component, Input, OnInit } from '@angular/core';
import { Petition } from '../../model/petition';
import { PetitionService } from '../../service/petition.service';
import { CommonModule } from '@angular/common';
import { Class } from '../../model/class';
import { ClassService } from '../../service/class.service';
import { LoginComponent } from '../../page/login/login.component';

@Component({
    selector: 'app-petition-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './petition-list.component.html',
    styleUrls: ['./petition-list.component.css']
})
export class PetitionListComponent implements OnInit {
    @Input() petitions: Petition[] | undefined;
    isTeacher = LoginComponent.isTeacher;// Propiedad para determinar si es profesor o no

    constructor(private petitionService: PetitionService, private classService: ClassService) { }

    ngOnInit(): void {
        // Obtener información sobre si es profesor o no
        // Por ejemplo, puedes recibir esta información a través de una llamada a la API o algún servicio de autenticación
        this.isTeacher;// O false, dependiendo de tu lógica de negocio
        // Puedes realizar alguna inicialización adicional aquí si es necesario
    }
    /**
     *  Funcion para aceptar o denegar una petición 
     * @param petition  
     */

    toggleExpand(petition: Petition): void {
        petition.expanded = !petition.expanded;
    }
    /**
     *  Funcion para aceptar una petición 
     * @param petition 
     */

    acceptPetition(petition: Petition): void {
        const newMessage = window.prompt('Editar mensaje de la petición:', petition.message);
        if (newMessage !== null) {
            this.petitionService.updatePetitionStateAndMessage(petition, 'Aceptada', newMessage).subscribe(
                () => {
                   
                    // Actualizar localmente el estado y el mensaje de la petición
                    petition.state = 'Aceptada';
                    petition.message = newMessage;
                },
                error => {
                    console.error('Error accepting petition:', error);
                    // Puedes manejar el error aquí.
                }
            );
        }
    }
/**
 *  Funcion para denegar una petición 
 * @param petition 
 */
    denyPetition(petition: Petition): void {
        const newMessage = window.prompt('Editar mensaje de la petición:', petition.message);
        if (newMessage !== null) {
            this.petitionService.updatePetitionStateAndMessage(petition, 'Denegada', newMessage).subscribe(
                () => {
                  
                    // Actualizar localmente el estado y el mensaje de la petición
                    petition.state = 'Denegada';
                    petition.message = newMessage;
                },
                error => {
                    console.error('Error denying petition:', error);
                    // Puedes manejar el error aquí.
                }
            );
        }
    }
/**
 *  Funcion para obtener el color de fondo de una petición dependiendo del estado de la misma
 * @param state 
 * @returns color de fondo
 */
    getBackgroundColor(state: string): string {
        switch (state) {
            case 'Aceptada':
                return 'lightgreen';
            case 'Denegada':
                return 'lightcoral';
            case 'Pendiente': // Añadimos este caso para el estado 'pending'
                return 'lightgrey';
            default:
                return 'gray'; // Si el estado no coincide con ninguno de los anteriores, devuelve gris
        }
    }

}
