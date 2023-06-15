import { FormaPago } from "./FormaPago";
import { Usuario } from "./Usuario";

export interface FormaPagoUsuario {
  id: number;
  datos: string;
  usuario: Usuario;
  formaPago: FormaPago;
}
