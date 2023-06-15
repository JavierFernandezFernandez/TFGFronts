export interface Producto {
  nombre:      string;
  precio:      number;
  iva:         number;
  descripcion: string;
  marca:       Categoria;
  categoria:   Marca;
  id:          number;
  cantidad?:    number;
  stock?:    number;
}

export interface Categoria {
  id:          number;
  nombre:      string;
  descripcion: string;
}

export interface Marca {
  id:          number;
  nombre:      string;
  descripcion: string;
}


