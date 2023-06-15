import { Empleado } from "./Empleado.model";
import { FormaPago } from "./FormaPago.model";


export interface Pedido {
  id: number;
  fecha: string;
  fechaEntrega: string;
  empleado: Empleado;
  formaPago: FormaPago;
  estado: string;
}
