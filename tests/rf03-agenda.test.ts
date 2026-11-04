import { Agenda } from '../src/dominio/Agenda';
import { Contacto } from '../src/dominio/Contacto';
import { Correo } from '../src/dominio/Correo';
import { ErrorDominio } from '../src/dominio/ErrorDominio';

describe('RF-03: Agenda de contactos', () => {
  let agenda: Agenda;

  beforeEach(() => {
    agenda = new Agenda();
  });

  it('agrega nuevos contactos', () => {
    agenda.agregar(new Contacto('Ana Gomez', 'ana@ucp.edu.ar'));
    agenda.agregar(new Contacto('Bruno Diaz', 'bruno@gmail.com'));

    expect(agenda.cantidad).toBe(2);
  });

  it('consulta un contacto existente por su direccion', () => {
    const ana = agenda.agregar(new Contacto('Ana Gomez', 'ana@ucp.edu.ar'));

    expect(agenda.obtener('ana@ucp.edu.ar')).toBe(ana);
    expect(agenda.obtener('ANA@UCP.EDU.AR')).toBe(ana);
    expect(agenda.existe('ana@ucp.edu.ar')).toBe(true);
    expect(agenda.listar()).toEqual([ana]);
  });

  it('informa error al consultar un contacto inexistente', () => {
    expect(() => agenda.obtener('nadie@ucp.edu.ar')).toThrow(ErrorDominio);
  });

  it('impide contactos duplicados por direccion de correo (sin distinguir mayusculas)', () => {
    agenda.agregar(new Contacto('Ana Gomez', 'ana@ucp.edu.ar'));

    expect(() => agenda.agregar(new Contacto('Otra Ana', 'ANA@ucp.edu.ar'))).toThrow(ErrorDominio);
    expect(agenda.cantidad).toBe(1);
  });

  it('modifica el nombre de un contacto existente', () => {
    agenda.agregar(new Contacto('Ana Gomez', 'ana@ucp.edu.ar'));

    agenda.modificar('ana@ucp.edu.ar', { nombre: 'Ana Maria Gomez' });

    expect(agenda.obtener('ana@ucp.edu.ar').nombre).toBe('Ana Maria Gomez');
  });

  it('modifica la direccion de un contacto existente', () => {
    agenda.agregar(new Contacto('Ana Gomez', 'ana@ucp.edu.ar'));

    agenda.modificar('ana@ucp.edu.ar', { email: 'ana.gomez@ucp.edu.ar' });

    expect(agenda.existe('ana@ucp.edu.ar')).toBe(false);
    expect(agenda.obtener('ana.gomez@ucp.edu.ar').nombre).toBe('Ana Gomez');
  });

  it('no permite modificar la direccion a una ya registrada ni a una invalida', () => {
    agenda.agregar(new Contacto('Ana Gomez', 'ana@ucp.edu.ar'));
    agenda.agregar(new Contacto('Bruno Diaz', 'bruno@gmail.com'));

    expect(() => agenda.modificar('ana@ucp.edu.ar', { email: 'bruno@gmail.com' })).toThrow(ErrorDominio);
    expect(() => agenda.modificar('ana@ucp.edu.ar', { email: 'invalida' })).toThrow(ErrorDominio);
    expect(agenda.obtener('ana@ucp.edu.ar').nombre).toBe('Ana Gomez');
    expect(agenda.cantidad).toBe(2);
  });

  it('elimina contactos de la agenda', () => {
    agenda.agregar(new Contacto('Ana Gomez', 'ana@ucp.edu.ar'));

    agenda.eliminar('ana@ucp.edu.ar');

    expect(agenda.existe('ana@ucp.edu.ar')).toBe(false);
    expect(agenda.cantidad).toBe(0);
    expect(() => agenda.eliminar('ana@ucp.edu.ar')).toThrow(ErrorDominio);
  });

  it('eliminar un contacto no elimina los correos que lo referencian', () => {
    const ana = agenda.agregar(new Contacto('Ana Gomez', 'ana@ucp.edu.ar'));
    const bruno = agenda.agregar(new Contacto('Bruno Diaz', 'bruno@gmail.com'));
    const correo = new Correo({ asunto: 'Hola', remitente: ana, destinatarios: [bruno] });

    agenda.eliminar('bruno@gmail.com');

    expect(agenda.existe('bruno@gmail.com')).toBe(false);
    expect(correo.destinatarios).toEqual([bruno]);
    expect(correo.destinatarios[0].email).toBe('bruno@gmail.com');
  });

  it('modificar un contacto no altera los datos de los correos que ya lo usan', () => {
    const ana = agenda.agregar(new Contacto('Ana Gomez', 'ana@ucp.edu.ar'));
    const bruno = agenda.agregar(new Contacto('Bruno Diaz', 'bruno@gmail.com'));
    const correo = new Correo({ asunto: 'Hola', remitente: ana, destinatarios: [bruno] });

    agenda.modificar('bruno@gmail.com', { nombre: 'Bruno Alberto Diaz' });

    expect(agenda.obtener('bruno@gmail.com').nombre).toBe('Bruno Alberto Diaz');
    expect(correo.destinatarios[0].nombre).toBe('Bruno Diaz');
  });
});
