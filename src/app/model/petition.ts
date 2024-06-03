// petition.model.ts
import { client } from './client';

export interface Petition {
  status: string;
  id: number;
  message: string;
  state: string;
  date: Date;
  clientId: number;
  classId: number;
  expanded: boolean | undefined;
  photoBase64: string;
  name: string;
  photo: string;
  client: client;
  client_photo: string; // Agregar esta propiedad
}
