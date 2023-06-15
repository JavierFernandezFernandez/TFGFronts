import { Direccion } from "./Direccion";
import { FormaPago } from "./FormaPago";
import { LineaPedido } from "./LineaPedido";
import { Usuario } from "./Usuario";

export interface Pedido {
  id: number;
  fecha: string;
  fechaEntrega: string;
  usuario: Usuario;
  direccion: Direccion;
  formaPago: FormaPago;
  estado: string;
  lines?: LineaPedido[];
  totalPrice?: number;
}
