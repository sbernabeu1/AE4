import { Contacto } from './Contacto';
import { ErrorDominio } from './ErrorDominio';

export interface DatosCorreo {
  asunto?: string;
  cuerpo?: string;
  remitente?: Contacto;
  destinatarios?: Contacto[];
}

export class Correo {
  private static contador = 0;

  readonly id: string;
  private _asunto: string = '';
  private _cuerpo: string = '';
  private _remitente: Contacto | undefined = undefined;
  private _destinatarios: Contacto[] = [];
  private _leido: boolean = false;
  private _favorito: boolean = false;

  constructor(datos: DatosCorreo = {}) {
    Correo.contador = Correo.contador + 1;
    this.id = 'C' + Correo.contador;
    this.editar(datos);
  }

  get asunto(): string {
    return this._asunto;
  }

  get cuerpo(): string {
    return this._cuerpo;
  }

  get remitente(): Contacto | undefined {
    return this._remitente;
  }

  get destinatarios(): Contacto[] {
    return this._destinatarios.slice();
  }

  get leido(): boolean {
    return this._leido;
  }

  get favorito(): boolean {
    return this._favorito;
  }

  editar(datos: DatosCorreo): void {
    if (datos.asunto !== undefined) {
      this.cambiarAsunto(datos.asunto);
    }
    if (datos.cuerpo !== undefined) {
      this.cambiarCuerpo(datos.cuerpo);
    }
    if (datos.remitente !== undefined) {
      this.cambiarRemitente(datos.remitente);
    }
    if (datos.destinatarios !== undefined) {
      this.cambiarDestinatarios(datos.destinatarios);
    }
  }

  cambiarAsunto(asunto: string): void {
    this._asunto = asunto;
  }

  cambiarCuerpo(cuerpo: string): void {
    this._cuerpo = cuerpo;
  }

  cambiarRemitente(remitente: Contacto): void {
    this._remitente = remitente;
  }

  agregarDestinatario(contacto: Contacto): void {
    if (this.tieneDestinatario(contacto.email)) {
      throw new ErrorDominio(contacto.email + ' ya es destinatario');
    }
    this._destinatarios.push(contacto);
  }

  quitarDestinatario(email: string): void {
    if (!this.tieneDestinatario(email)) {
      throw new ErrorDominio(email + ' no es destinatario');
    }
    this._destinatarios = this._destinatarios.filter((d) => !d.tieneEmail(email));
  }

  cambiarDestinatarios(lista: Contacto[]): void {
    const nuevos: Contacto[] = [];
    for (const contacto of lista) {
      for (const agregado of nuevos) {
        if (agregado.email === contacto.email) {
          throw new ErrorDominio(contacto.email + ' esta repetido en los destinatarios');
        }
      }
      nuevos.push(contacto);
    }
    this._destinatarios = nuevos;
  }

  tieneDestinatario(email: string): boolean {
    return this._destinatarios.some((d) => d.tieneEmail(email));
  }

  marcarComoLeido(): void {
    this._leido = true;
  }

  marcarComoNoLeido(): void {
    this._leido = false;
  }

  marcarComoFavorito(): void {
    this._favorito = true;
  }

  desmarcarFavorito(): void {
    this._favorito = false;
  }

  erroresDeEnvio(): string[] {
    const errores: string[] = [];
    if (this._remitente === undefined) {
      errores.push('El correo debe tener un remitente');
    }
    if (this._asunto.trim() === '') {
      errores.push('El correo debe tener un asunto valido');
    }
    if (this._destinatarios.length === 0) {
      errores.push('El correo debe tener al menos un destinatario');
    }
    return errores;
  }

  esValidoParaEnvio(): boolean {
    return this.erroresDeEnvio().length === 0;
  }
}
