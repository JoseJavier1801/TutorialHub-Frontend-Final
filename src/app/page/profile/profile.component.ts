import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { ClassFormComponent } from '../../components/class-form/class-form.component';
import { CommonModule } from '@angular/common';
import { ClassCardComponentComponent } from '../../components/class-card-component/class-card-component.component';
import { ClassService } from '../../service/class.service';
import { MyProfileComponent } from '../../components/my-profile/my-profile.component';
import { TeacherProfileComponent } from '../../components/teacher-profile/teacher-profile.component';
import { UserService } from '../../service/user.service';
import { LoginComponent } from '../login/login.component';
import { Subscription, map, mergeMap, toArray } from 'rxjs';
import { teacher } from '../../model/teacher';
import { TeacherService } from '../../service/teacher.service';
import { client } from '../../model/client';
import { Class } from 'leaflet';
import { EditFormComponent } from '../../components/edit-form/edit-form.component';
import { ListUserComponent } from '../../components/list-user/list-user.component';
import { TableComponent } from '../../components/table/table.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ClassFormComponent, CommonModule, ClassCardComponentComponent, MyProfileComponent, TeacherProfileComponent, EditFormComponent, ListUserComponent,TableComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  classes: any[] = [];
  selectedClassId: number = 0;
  clients: any[] = []; // Propiedad para almacenar los clientes obtenidos
  isTeacher: boolean = LoginComponent.isTeacher;

  private teacherProfileUpdatedSubscription: Subscription | undefined;

  constructor(private classService: ClassService, private userService: UserService, private teacherService: TeacherService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    const teacherId = LoginComponent.userId;
    if (teacherId !== null) {
      this.classService.getClassesByTeacherId(teacherId).subscribe(
        (classes: any[]) => {
          this.classes = classes;
        },
        (error) => {
          console.error('Error al cargar las clases:', error);
        }
      );
    } else {
      console.error('teacherId es nulo.');
    }
  }

  ngOnDestroy(): void {
    if (this.teacherProfileUpdatedSubscription) {
      this.teacherProfileUpdatedSubscription.unsubscribe();
    }
  }

  classClicked(classId: number): void {
    console.log('Class clicked with ID:', classId);
    this.selectedClassId = classId;
  }
  addClass(newClass: any): void {
    this.classService.addClass(newClass).subscribe(() => {
      this.refreshClasses();
    });
  }
  refreshClasses() {
    throw new Error('Method not implemented.');
  }


  listMyClients(option: number): void {
    const userId = LoginComponent.userId;
    const classId = this.selectedClassId;
    console.log('teacherId:', userId, 'classId:', classId, 'option:', option);
    if (userId !== null) {
      this.userService.getDistinctClientInfoByTeacherId(userId, classId, option).subscribe(
        (clientInfo: any[]) => {
          console.log('Clientes obtenidos:', clientInfo);
          this.clients = clientInfo; // Asigna los clientes obtenidos a la propiedad clients
        },
        (error) => {
          console.error('Error al obtener la información de los clientes:', error);
        }
      );
    } else {
      console.error('teacherId es nulo.');
    }
  }
  openWhatsAppWeb() {
    window.open('https://web.whatsapp.com', '_blank');
  }
}