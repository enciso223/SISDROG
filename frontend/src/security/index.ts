/**
 * Barrel del módulo de seguridad frontend.
 * Cubre la historia "Seguridad básica de la información":
 *  - Contraseñas (política y fortaleza)
 *  - Sesiones activas (timeout por inactividad)
 *  - Datos sensibles (enmascaramiento en UI y logs)
 *  - Errores (sanitización sin exponer detalles técnicos)
 */

export * from './passwordPolicy';
export * from './errorSanitizer';
export * from './secureStorage';
export * from './dataMasking';
export * from './sessionManager';
