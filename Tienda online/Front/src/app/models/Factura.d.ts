import { Direccion } from "./Direccion";
import { LineaFactura } from "./LineaFactura";
import { Usuario } from "./Usuario";

export interface Factura {
  id: number;
  observaciones: string;
  fecha: string;
  usuario: Usuario;
  direccion: Direccion;
  line?: LineaFactura[];
}
