import { Contacto } from '../src/dominio/Contacto';

export function crearContactos() {
  return {
    ana: new Contacto('Ana Gomez', 'ana.gomez@ucp.edu.ar'),
    bruno: new Contacto('Bruno Diaz', 'bruno.diaz@gmail.com'),
    carla: new Contacto('Carla Ruiz', 'carla.ruiz@ucp.edu.ar'),
    diego: new Contacto('Diego Perez', 'diego@empresa.com'),
  };
}
