import { Factura } from "./Factura.model";
import { Pedido } from "./Pedido.model";
import { Producto } from "./Producto.model";

export interface LineaPedido {
  id: number;
  precio: number;
  iva: number;
  unidades: number;
  producto: Producto;
  pedido: Pedido;
  factura: Factura;
}
