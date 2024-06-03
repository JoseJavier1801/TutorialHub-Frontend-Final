import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from '../../service/map.service';
import { ClassService } from '../../service/class.service';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../service/teacher.service';
import { teacher } from '../../model/teacher';
import { Class } from '../../model/class';
import { LoginComponent } from '../../page/login/login.component';

@Component({
  selector: 'app-class-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.css']
})
export class ClassFormComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  formData: any = {
    id: '',
    description: '',
    type: '',
    category: '',
    location: { latitude: 0, longitude: 0 },
    direction: '',
    postalCode: '',
    province: '',
    teacherId: LoginComponent.userId !== null ? LoginComponent.userId.toString() : '', // Usar LoginComponent.userId
    localidad: '',
    duration: '',
    price: '',
    video:'',
  };
  successMessage: string = '';
  errorMessage: string = '';
  locationActivatedMessage: string = '';

  mapService: MapService;

  constructor(
    private classService: ClassService,
    private teacherService: TeacherService,
    private _mapService: MapService
  ) {
    this.mapService = _mapService;
  }

  ngOnInit(): void {
    this.mapService.initializeMapForPointSelection();

    // Suscribirse al EventEmitter del servicio para capturar las coordenadas de la marca
    this.mapService.markerPositionEmitter.subscribe((position: { latitude: number, longitude: number }) => {
      console.log('Coordenadas:', position);
      // Asignar las coordenadas a formData.location
      this.formData.location.latitude = position.latitude;
      this.formData.location.longitude = position.longitude;
    });
  }
/**
 * Funcion para cerrar el popup
 */
  closeClassForm(): void {
    this.close.emit();
  }
/**
 * Funcion para activar la ubicación del usuario y mostrar un mensaje de exito
 */
  activateLocation(): void {
    if (this.mapService) {
      this.mapService.getCurrentLocation().then((position: any) => {
        if (position && position.coords) {
          this.formData.location.latitude = position.coords.latitude;
          this.formData.location.longitude = position.coords.longitude;
          this.locationActivatedMessage = 'Ubicación obtenida con éxito.';
          
        } else {
          console.error('Error al obtener la ubicación: posición nula.');
          this.locationActivatedMessage = 'Error al obtener la ubicación.';
        }
      }).catch((error: any) => {
        console.error('Error al obtener la ubicación:', error);
        this.locationActivatedMessage = 'Error al obtener la ubicación.';
      });
    } else {
      console.error('Error: mapService no está definido.');
      this.locationActivatedMessage = 'Error al obtener la ubicación.';
    }
  }
/**
 *  Funcion para enviar el formulario para crear la clase y mostrar un mensaje de exito o de error en consecuencia
 * @returns 
 */
  submitForm(): void {
    // Validar si todos los campos están rellenados
    if (!this.isFormValid()) {
      this.errorMessage = 'Rellena todos los campos';
      return;
    }

    try {
      let newClass: any = {
        id: '', // El ID probablemente será generado por el backend, así que dejémoslo como una cadena vacía por ahora
        description: this.formData.description,
        type: this.formData.type,
        category: this.formData.category,
        lat: this.formData.location.latitude,
        lng: this.formData.location.longitude,
        direction: this.formData.direction,
        postalCode: this.formData.postalCode,
        province: this.formData.province, // Corregir aquí
        duration: this.formData.duration, // Mantener la duración aquí
        localidad: this.formData.localidad,
        teacherID: this.formData.teacherId, // Cambiamos teacherId a teacherID para que coincida con el nombre esperado en el backend
        price: this.formData.price, // Nuevo campo para el precio
        video: this.formData.video // Nuevo campo para el video
      };

      // Mostrar por consola los datos que se van a enviar a la base de datos
      console.log('Datos que se enviarán a la base de datos:', newClass);

      this.classService.addClass(newClass).subscribe(() => {
        console.log('Clase creada con éxito:', newClass);
        this.successMessage = 'Clase creada con éxito';
        this.errorMessage = '';
        this.clearFormFields();
      }, (error) => {
        console.error('Error al crear la clase:', error);
        this.errorMessage = 'Error al crear la clase';
        this.successMessage = '';
      });
    } catch (error) {
      console.error('Error al crear la clase:', error);
      this.errorMessage = 'Error al crear la clase';
      this.successMessage = '';
    }
  }
  onVideoSelected(event: any): void {
    const file: File = event.target.files[0];

    // Verificar si se seleccionó un archivo
    if (file) {
      const reader: FileReader = new FileReader();

      reader.onload = () => {
        // Obtener el contenido del archivo como una cadena base64
        const base64String: string = (reader.result as string).split(',')[1]; // Eliminar el prefijo "data:video/mp4;base64,"

        // Asignar la cadena base64 al campo de video en formData
        this.formData.video = base64String;
      };

      // Leer el archivo como una URL de datos
      reader.readAsDataURL(file);
    }
  }



/**
 *  Funcion para validar si todos los campos están rellenados
 * @returns  true si todos los campos estan rellenados, false en caso contrario
 */
  isFormValid(): boolean {
    return !!this.formData.description && !!this.formData.type && !!this.formData.category
      && !!this.formData.location.latitude && !!this.formData.location.longitude
      && !!this.formData.direction && !!this.formData.postalCode && !!this.formData.province
      && !!this.formData.duration && !!this.formData.localidad;
  }

  clearFormFields(): void {
    this.formData = {
      id: '',
      description: '',
      type: '',
      category: '',
      location: { latitude: 0, longitude: 0 },
      direction: '',
      postalCode: '',
      province: '',
      localidad: '',
      duration: '',
    };
  }
}
