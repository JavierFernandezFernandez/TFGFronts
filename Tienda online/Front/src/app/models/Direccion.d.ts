import { Usuario } from "./Usuario";

export interface Direccion {
  nombre: string;
  ciudad: string;
  direccion: string;
  cp: string;
  usuario: Usuario;
  id: number;
}
