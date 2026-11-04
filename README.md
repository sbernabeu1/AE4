# Gestor de Correos Electronicos con Filtros Dinamicos

**AE4 - Trabajo Practico Integrador - Paradigmas II - ISI - UCP 2026**

Sistema que simula un cliente de correo electronico, desarrollado en **TypeScript**
aplicando Programacion Orientada a Objetos y Programacion Funcional, con desarrollo guiado por pruebas (TDD).

## Estado actual: Sprint 1

**Objetivo:** base del proyecto y modelo de dominio (contactos y correos).

| RF | Descripcion | Clases | Tests |
|----|-------------|--------|-------|
| RF-03 | Gestion de contactos | `Contacto`, `Agenda` | `tests/rf03-contacto.test.ts`, `tests/rf03-agenda.test.ts` |
| RF-01 | Creacion de correos | `Correo` | `tests/rf01-correo.test.ts` |

Proximos Sprints:
- **Sprint 2:** bandejas (con polimorfismo), envio, borradores y leido/no leido (RF-06, RF-02, RF-07, RF-08).
- **Sprint 3:** busqueda, filtros dinamicos, favoritos y procesamiento funcional (RF-04, RF-05, RF-09, RF-10).

## Requisitos

- Node.js 18 o superior
- npm

## Uso

```bash
npm install          # instala TypeScript, Jest y ts-jest
npm test             # ejecuta los tests
npm run typecheck    # verifica tipos
npm run build        # compila src/ a dist/
```

## Estructura

```
src/dominio/
|-- ErrorDominio.ts   error para reglas del dominio
|-- Contacto.ts       nombre y email validado
|-- Agenda.ts         alta, consulta, modificacion y baja de contactos
`-- Correo.ts         id unico, asunto, cuerpo, remitente, destinatarios, leido, favorito
tests/                pruebas unitarias por clase
.github/workflows/    integracion continua (GitHub Actions)
```

## Decisiones de diseno (Sprint 1)

- **Contactos duplicados:** dos contactos son el mismo si tienen el mismo email, sin importar mayusculas ni espacios.
- **Contacto inmutable:** modificar un contacto en la agenda crea uno nuevo; los correos que ya lo usaban conservan sus datos.
- **Eliminar un contacto** de la agenda no afecta a los correos que lo referencian.
- **Destinatarios protegidos:** el correo devuelve una copia de la lista; solo se modifica con `agregarDestinatario`, `quitarDestinatario` o `cambiarDestinatarios`, que no permiten repetidos.
- **Datos obligatorios** (remitente, asunto, al menos un destinatario): el correo informa que falta con `erroresDeEnvio()`; se exigiran al enviar (Sprint 2), porque un borrador puede estar incompleto.
