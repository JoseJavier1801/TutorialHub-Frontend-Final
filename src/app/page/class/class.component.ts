import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClassFormComponent } from '../../components/class-form/class-form.component';
import { CommonModule } from '@angular/common';
import { ClassService } from '../../service/class.service';
import { ClassCardComponentComponent } from '../../components/class-card-component/class-card-component.component';
import { PetitionComponent } from '../../components/petition/petition.component';
import { Class } from '../../model/class';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http'; // Importa HttpParams
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [ClassFormComponent, CommonModule, ClassCardComponentComponent, FormsModule], // Importa FormsModule
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  classes: Class[] = [];
  visibleClasses: Class[] = [];
  pageSize = 2;
  currentPage = 0;
  totalClasses = 0;
  Noption: number = 0;
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(private classService: ClassService) { }

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.classService.getAllClassroomDetails().subscribe((details: any) => {

      this.classes = Object.values(details).map((detail: any) => ({
        id: +detail.id,
        teacherId: +detail.teacherId,
        description: detail.description,
        video: detail.video, // Asignar el valor del video correctamente
        type: detail.type,
        category: detail.category,
        location: { lat: +detail.lat, lng: +detail.lng },
        direction: detail.direction,
        postalCode: detail.postalCode,
        province: detail.province,
        duration: detail.duration,
        localidad: detail.localidad,
        photo: detail.photo,
        teacher: detail.teacher,
        price: detail.price, // Asignar el valor del precio correctamente
      }));
      this.totalClasses = this.classes.length;
      this.updateVisibleClasses();

      // Agregar console.log para imprimir los valores de price y video
     
      this.classes.forEach(cls => {
        
      });
    });
  }

  updateVisibleClasses() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.visibleClasses = this.classes.slice(startIndex, endIndex);
  }

  hasNextPage(): boolean {
    return (this.currentPage + 1) * this.pageSize < this.classes.length;
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }

  nextPage() {
    if (this.hasNextPage()) {
      this.currentPage++;
      this.updateVisibleClasses();
    }
  }

  previousPage() {
    if (this.hasPreviousPage()) {
      this.currentPage--;
      this.updateVisibleClasses();
    }
  }

  setNoptionOne() {
    this.Noption = 1;
    console.log('Valor de Noption (setNoptionOne):', this.Noption);
    this.classService.getClassesByFilter(this.minPrice, this.maxPrice, this.Noption).subscribe((classes: Class[]) => {
      this.classes = classes;
      this.totalClasses = this.classes.length;
      this.updateVisibleClasses();
    });
  }

  setNoptionTwo() {
    this.Noption = 2;
    console.log('Valor de Noption (setNoptionTwo):', this.Noption);
    // Llamar a la función de servicio con los filtros necesarios
    this.classService.getClassesByFilter(this.minPrice, this.maxPrice, this.Noption).subscribe((classes: Class[]) => {
      this.classes = classes;
      this.totalClasses = this.classes.length;
      this.updateVisibleClasses();
    });
  }

  setNoptionThree() {
    this.Noption = 3;
    console.log('Valor de Noption (setNoptionThree):', this.Noption);
    this.classService.getClassesByFilter(this.minPrice, this.maxPrice, this.Noption).subscribe((classes: Class[]) => {
      this.classes = classes;
      this.totalClasses = this.classes.length;
      this.updateVisibleClasses();
    });
  }
 
}
