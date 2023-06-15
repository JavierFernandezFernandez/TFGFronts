import { Empleado } from "./Empleado.model";
import { LineaFactura } from "./LineaFactura.model";

export interface Factura {
  id: number;
  observaciones: string;
  fecha: string;
  empleado: Empleado;
  lineasFactura?: LineaFactura[];
}
