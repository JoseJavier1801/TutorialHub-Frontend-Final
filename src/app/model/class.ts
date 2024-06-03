import { teacher } from "./teacher"; // Asegúrate de importar la interfaz correcta para Teacher

export interface Class {
    id: number;
    teacherId: number;
    description: string;
    type: string;
    category: string;
    location: { lat: number; lng: number } | null;
    direction: string;
    postalCode: string;
    province: string;
    duration: string;
    localidad: string;
    photo: string;
    teacher: teacher; // Corregido para que sea Teacher en lugar de any
    price: number;
    video: string;
}
