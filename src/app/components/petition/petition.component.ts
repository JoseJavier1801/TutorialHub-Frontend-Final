import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Petition } from '../../model/petition';
import { PetitionService } from '../../service/petition.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs';
import { LoginComponent } from '../../page/login/login.component';

@Component({
  selector: 'app-petition',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './petition.component.html',
  styleUrls: ['./petition.component.css']
})
export class PetitionComponent {
  @Input() isPetitionVisible = true;
  @Input() classroomId: number | undefined;
  @Output() petitionSubmitted = new EventEmitter<Petition>();
  petitionForm: FormGroup;
  showConfirmation: boolean = false;

  constructor(private petitionService: PetitionService, private fb: FormBuilder) {
    this.petitionForm = this.fb.group({
      message: ['', Validators.required],
      state: [null],
      date: [new Date(), Validators.required],
    });
  }
  /**
   * Funcion para obtener los controles del formulario
   */

  get petitionFormControls() {
    return this.petitionForm.controls;
  }
  /**
   * Funcion para establecer la fecha de creacion de la petecion 
   */

  setCreationDate(): void {
    this.petitionForm.controls['date'].setValue(new Date());
  }
/**
 * Funcion para enviar la petecion 
 */
  submitPetition(): void {
    if (this.petitionForm.valid && this.classroomId) {
      const userId = LoginComponent.isTeacher ? LoginComponent.userId! : LoginComponent.userId!;
      const message = this.petitionForm.value.message;
      const state = this.petitionForm.value.state;
      const date = this.petitionForm.value.date;

      this.petitionService.addPetition(this.classroomId, userId, message, state, date)
        .subscribe(
          (response: Petition) => {
           
            this.petitionSubmitted.emit(response);
            this.showConfirmation = true;
          },
          (error) => {
            console.error('Error adding petition:', error);
          }
        );
    }
  }
}