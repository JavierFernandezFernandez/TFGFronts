import { Ejemplar } from "./Ejemplar";

export interface Producto {
  nombre: string;
  precio: number;
  iva: number;
  descripcion: string;
  marca: Marca;
  categoria: Categoria;
  id: number;
  quantity?: number
  addCartSuccess?: boolean;
  units?: Ejemplar[]
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Marca {
  id: number;
  nombre: string;
  descripcion: string;
}
