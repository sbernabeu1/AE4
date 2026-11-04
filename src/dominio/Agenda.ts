import { Contacto } from './Contacto';
import { ErrorDominio } from './ErrorDominio';

export class Agenda {
  private contactos: Contacto[] = [];

  agregar(contacto: Contacto): Contacto {
    if (this.existe(contacto.email)) {
      throw new ErrorDominio('Ya existe un contacto con el email ' + contacto.email);
    }
    this.contactos.push(contacto);
    return contacto;
  }

  existe(email: string): boolean {
    return this.contactos.some((c) => c.tieneEmail(email));
  }

  obtener(email: string): Contacto {
    const contacto = this.contactos.find((c) => c.tieneEmail(email));
    if (contacto === undefined) {
      throw new ErrorDominio('No existe un contacto con el email ' + email);
    }
    return contacto;
  }

  listar(): Contacto[] {
    return this.contactos.slice();
  }

  get cantidad(): number {
    return this.contactos.length;
  }

  modificar(email: string, cambios: { nombre?: string; email?: string }): Contacto {
    const actual = this.obtener(email);

    let nuevoNombre = actual.nombre;
    let nuevoEmail = actual.email;
    if (cambios.nombre !== undefined) {
      nuevoNombre = cambios.nombre;
    }
    if (cambios.email !== undefined) {
      nuevoEmail = cambios.email;
    }

    const modificado = new Contacto(nuevoNombre, nuevoEmail);
    if (!actual.tieneEmail(modificado.email) && this.existe(modificado.email)) {
      throw new ErrorDominio('Ya existe un contacto con el email ' + modificado.email);
    }

    const posicion = this.contactos.indexOf(actual);
    this.contactos[posicion] = modificado;
    return modificado;
  }

  eliminar(email: string): void {
    const contacto = this.obtener(email);
    this.contactos = this.contactos.filter((c) => c !== contacto);
  }
}
