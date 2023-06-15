import { Producto } from "./Producto";

export interface Ejemplar {
  id: number;
  serie: string;
  fechaVenta: Date;
  fechaCompra: Date;
  unidades: number;
  estado: string;
  producto: Producto;

}
