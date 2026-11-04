import { Contacto } from '../src/dominio/Contacto';
import { Correo } from '../src/dominio/Correo';
import { ErrorDominio } from '../src/dominio/ErrorDominio';
import { crearContactos } from './datosDePrueba';

describe('RF-01: Creacion de correos electronicos', () => {
  const { ana, bruno, carla, diego } = crearContactos();

  it('crea un correo con todas sus propiedades minimas', () => {
    const correo = new Correo({
      asunto: 'Examen final',
      cuerpo: 'El examen es el lunes',
      remitente: ana,
      destinatarios: [bruno, carla],
    });

    expect(correo.id).toBeDefined();
    expect(correo.asunto).toBe('Examen final');
    expect(correo.cuerpo).toBe('El examen es el lunes');
    expect(correo.remitente).toBe(ana);
    expect(correo.destinatarios).toEqual([bruno, carla]);
    expect(correo.leido).toBe(false);
    expect(correo.favorito).toBe(false);
  });

  it('permite crear multiples correos con diferentes remitentes y destinatarios', () => {
    const correo1 = new Correo({ asunto: 'Uno', remitente: ana, destinatarios: [bruno] });
    const correo2 = new Correo({ asunto: 'Dos', remitente: diego, destinatarios: [carla, ana] });

    expect(correo1.remitente).toBe(ana);
    expect(correo2.remitente).toBe(diego);
    expect(correo1.destinatarios).toEqual([bruno]);
    expect(correo2.destinatarios).toEqual([carla, ana]);
  });

  it('asigna a cada correo un identificador unico', () => {
    const correo1 = new Correo({ asunto: 'Igual' });
    const correo2 = new Correo({ asunto: 'Igual' });
    const correo3 = new Correo();

    expect(correo1.id).not.toBe(correo2.id);
    expect(correo1.id).not.toBe(correo3.id);
    expect(correo2.id).not.toBe(correo3.id);
  });

  it('el remitente es un unico objeto Contacto y los destinatarios una coleccion de Contacto', () => {
    const correo = new Correo({ remitente: ana, destinatarios: [bruno, carla] });

    expect(correo.remitente).toBeInstanceOf(Contacto);
    correo.destinatarios.forEach((d) => expect(d).toBeInstanceOf(Contacto));
  });

  it('mantiene correctamente su informacion a lo largo del tiempo', () => {
    const correo = new Correo({ asunto: 'Proyecto', cuerpo: 'Avance', remitente: ana, destinatarios: [bruno] });
    correo.marcarComoLeido();
    correo.marcarComoFavorito();

    expect(correo.asunto).toBe('Proyecto');
    expect(correo.cuerpo).toBe('Avance');
    expect(correo.remitente).toBe(ana);
    expect(correo.leido).toBe(true);
    expect(correo.favorito).toBe(true);
  });

  describe('validacion de datos obligatorios', () => {
    it('un correo completo es valido para el envio', () => {
      const correo = new Correo({ asunto: 'Hola', remitente: ana, destinatarios: [bruno] });

      expect(correo.esValidoParaEnvio()).toBe(true);
      expect(correo.erroresDeEnvio()).toEqual([]);
    });

    it('informa los datos obligatorios faltantes', () => {
      const correo = new Correo({ asunto: '   ' });

      expect(correo.esValidoParaEnvio()).toBe(false);
      expect(correo.erroresDeEnvio()).toEqual([
        'El correo debe tener un remitente',
        'El correo debe tener un asunto valido',
        'El correo debe tener al menos un destinatario',
      ]);
    });

    it('rechaza destinatarios repetidos (misma direccion)', () => {
      const brunoMayusculas = new Contacto('Bruno D.', 'BRUNO.DIAZ@gmail.com');

      expect(() => new Correo({ destinatarios: [bruno, brunoMayusculas] })).toThrow(ErrorDominio);

      const correo = new Correo({ destinatarios: [bruno] });
      expect(() => correo.agregarDestinatario(brunoMayusculas)).toThrow(ErrorDominio);
    });
  });

  describe('proteccion de la coleccion de destinatarios', () => {
    it('modificar la lista obtenida no cambia los destinatarios del correo', () => {
      const correo = new Correo({ destinatarios: [bruno] });
      const lista = correo.destinatarios;

      lista.push(carla);

      expect(correo.destinatarios).toEqual([bruno]);
    });

    it('modificar el arreglo usado al crear el correo no afecta al correo', () => {
      const lista = [bruno];
      const correo = new Correo({ destinatarios: lista });
      lista.push(carla);

      expect(correo.destinatarios).toEqual([bruno]);
    });

    it('los destinatarios solo cambian mediante operaciones del correo', () => {
      const correo = new Correo({ destinatarios: [bruno] });
      correo.agregarDestinatario(carla);
      correo.quitarDestinatario('bruno.diaz@gmail.com');

      expect(correo.destinatarios).toEqual([carla]);
      expect(() => correo.quitarDestinatario('noexiste@x.com')).toThrow(ErrorDominio);
    });
  });
});
