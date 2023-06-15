import { Producto } from "./Producto";
import { Usuario } from "./Usuario";

export interface Comentario {
  mensaje:    string;
  titulo:     string;
  puntuacion: number;
  producto:   Producto;
  usuario:    Usuario;
  id:         number;
}
