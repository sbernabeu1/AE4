import { Contacto } from '../src/dominio/Contacto';
import { ErrorDominio } from '../src/dominio/ErrorDominio';

describe('RF-03: Contacto', () => {
  it('contiene nombre completo y direccion de correo', () => {
    const contacto = new Contacto('Ana Gomez', 'ana.gomez@ucp.edu.ar');

    expect(contacto.nombre).toBe('Ana Gomez');
    expect(contacto.email).toBe('ana.gomez@ucp.edu.ar');
  });

  it('rechaza direcciones con formato invalido', () => {
    const invalidos = ['ana', 'ana@', '@ucp.edu.ar', 'ana@ucp', 'ana gomez@ucp.edu.ar', ''];
    for (const email of invalidos) {
      expect(() => new Contacto('Ana', email)).toThrow(ErrorDominio);
    }
  });

  it('acepta direcciones con formato valido', () => {
    const validos = ['ana@ucp.edu.ar', 'ana.gomez+tp@gmail.com', 'a_b-c@sub.dominio.com'];
    for (const email of validos) {
      expect(() => new Contacto('Ana', email)).not.toThrow();
    }
  });

  it('exige un nombre', () => {
    expect(() => new Contacto('   ', 'ana@ucp.edu.ar')).toThrow(ErrorDominio);
  });

  it('normaliza la direccion (espacios y mayusculas)', () => {
    const contacto = new Contacto('Ana', '  Ana.Gomez@UCP.edu.ar ');

    expect(contacto.email).toBe('ana.gomez@ucp.edu.ar');
    expect(contacto.dominio).toBe('ucp.edu.ar');
  });
});
