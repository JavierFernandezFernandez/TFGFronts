import { Factura } from "./Factura";
import { Pedido } from "./Pedido";
import { Producto } from "./Producto";

export interface LineaPedido {
  id: number;
  precio: number;
  iva: number;
  unidades: number;
  producto: Producto;
  pedido: Pedido;
  factura: Factura;
}
