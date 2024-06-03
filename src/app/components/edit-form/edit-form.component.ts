import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { } from 'leaflet';
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../service/class.service';
import { Class } from '../../model/class';
import { MapService } from '../../service/map.service';

@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.css'
})
export class EditFormComponent implements OnInit {
  @Input() classData: Class | undefined;
  @Input() classId: number | undefined;
  successMessage: string = '';

  categoria: string | undefined;
  tipo: string | undefined;
  duracion: string | undefined;
  descripcion: string | undefined;
  codigoPostal: string | undefined;
  provincia: string | undefined;
  localidad: string | undefined;
  direccion: string | undefined;
  location: { lat: number; lng: number } | null | undefined;

  locationActivatedMessage: string | undefined;

  constructor(private classService: ClassService, private mapService: MapService) { }

  ngOnInit(): void {
    if (this.classData) {
      this.categoria = this.classData.category;
      this.tipo = this.classData.type;
      this.duracion = this.classData.duration;
      this.descripcion = this.classData.description;
      this.location = this.classData.location;
      this.codigoPostal = this.classData.postalCode;
      this.provincia = this.classData.province;
      this.localidad = this.classData.localidad;
      this.direccion = this.classData.direction;
    }

    this.mapService.initializeMapForPointSelection();

    this.mapService.markerPositionEmitter.subscribe((position: { lat: number; lng: number; }) => {
      console.log('Ubicación seleccionada:', position);
      this.location = position;
    });
  }

  activateLocation(): void {
    this.mapService.getCurrentLocation().then((position: any) => {
      if (position && position.coords) {
        this.location = { lat: position.coords.latitude, lng: position.coords.longitude };
        this.locationActivatedMessage = 'Ubicación obtenida con éxito.';
      } else {
        console.error('Error al obtener la ubicación: posición nula.');
        this.locationActivatedMessage = 'Error al obtener la ubicación.';
      }
    }).catch((error: any) => {
      console.error('Error al obtener la ubicación:', error);
      this.locationActivatedMessage = 'Error al obtener la ubicación.';
    });
  }
  updateClassroom(): void {
    const updatedClass: Partial<Class> = {
      category: this.categoria,
      type: this.tipo,
      duration: this.duracion,
      description: this.descripcion,
      postalCode: this.codigoPostal,
      province: this.provincia,
      localidad: this.localidad,
      direction: this.direccion,
      location: this.location ? { lat: this.location.lat, lng: this.location.lng } : null // Asignar un objeto de ubicación o null
    };

    if (this.classId) {
      console.log('Datos que se enviarán al modificar la clase:', updatedClass);
      this.classService.updateClassroom(this.classId, updatedClass as Class)
        .subscribe(() => {
          this.successMessage = 'Clase actualizada correctamente';
        }, (error: any) => {
          console.error('Error al actualizar la clase:', error);
        });
    }
  }


  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('Ubicación obtenida:', this.location);
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
        }
      );
    } else {
      console.error('Geolocalización no está disponible en este navegador.');
    }
  }
}