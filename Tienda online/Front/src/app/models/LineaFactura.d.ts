import { Factura } from "./Factura";
import { Producto } from "./Producto";


export interface LineaFactura {
  id: number;
  precio: number;
  iva: number;
  unidades: number;
  serie: string;
  producto: Producto;
  factura: Factura;
}
