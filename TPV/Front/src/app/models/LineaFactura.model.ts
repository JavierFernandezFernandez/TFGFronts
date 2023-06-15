import { Factura } from "./Factura.model";
import { Producto } from "./Producto.model";

export interface LineaFactura {
  id: number;
  precio: number;
  iva: number;
  unidades: number;
  serie: string;
  producto: Producto;
  factura: Factura;
}
