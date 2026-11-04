import { ErrorDominio } from './ErrorDominio';

export class Contacto {
  readonly nombre: string;
  readonly email: string;

  constructor(nombre: string, email: string) {
    const nombreLimpio = nombre.trim();
    const emailLimpio = email.trim().toLowerCase();

    if (nombreLimpio === '') {
      throw new ErrorDominio('El nombre del contacto es obligatorio');
    }
    if (!Contacto.esEmailValido(emailLimpio)) {
      throw new ErrorDominio('El email ' + email + ' no es valido');
    }

    this.nombre = nombreLimpio;
    this.email = emailLimpio;
  }

  static esEmailValido(email: string): boolean {
    const texto = email.trim();
    if (texto.includes(' ')) {
      return false;
    }

    const partes = texto.split('@');
    if (partes.length !== 2) {
      return false;
    }

    const usuario = partes[0];
    const dominio = partes[1];
    if (usuario === '' || dominio === '') {
      return false;
    }
    if (!dominio.includes('.') || dominio.startsWith('.') || dominio.endsWith('.')) {
      return false;
    }
    return true;
  }

  get dominio(): string {
    return this.email.split('@')[1];
  }

  tieneEmail(email: string): boolean {
    return this.email === email.trim().toLowerCase();
  }
}
