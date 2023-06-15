import { Producto } from "./Producto.model";
import { Tienda } from "./Tienda.model";

export interface Ejemplar {
  serie:       string;
  fechaVenta:  Date;
  fechaCompra: Date;
  unidades:    number;
  estado:      string;
  producto:    Producto;
  tienda:      Tienda;
  id:          number;
}

