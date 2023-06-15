export interface Empleado {
  nombre:   string;
  email:    string;
  telefono: string;
  password: string;
  rol:      Rol;
  id:       number;

}

export interface Rol {
  id:       number;
  rol:      string;
}
