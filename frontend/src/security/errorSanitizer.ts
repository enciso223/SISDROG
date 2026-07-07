/**
 * Sanitizador de errores.
 *
 * Traduce errores técnicos del backend/red en mensajes amigables sin exponer
 * detalles sensibles (stack traces, rutas, IDs internos, SQL, etc.) al usuario
 * final. Cumple con el criterio: "un error no debe exponer información sensible".
 */

/** Patrones que suelen indicar información técnica que NO debe mostrarse. */
const SENSITIVE_PATTERNS: RegExp[] = [
  /Traceback[\s\S]+/i,
  /at\s+[\w./]+:\d+:\d+/i, // stack frames JS
  /File\s+".+",\s+line\s+\d+/i, // stack frames Python
  /(select|insert|update|delete|drop)\s+.+from/i, // fragmentos SQL
  /psycopg2|sqlalchemy|pydantic|fastapi/i,
  /localhost|127\.0\.0\.1|0\.0\.0\.0/i,
  /(bearer|token|jwt|password|secret|api[_-]?key)\s*[:=]\s*[^\s]+/i,
  /\/(usr|home|var|etc|app)\//i, // rutas de archivos
  /at\s+0x[0-9a-f]+/i, // direcciones de memoria
];

/** Mapeo de códigos HTTP a mensajes seguros. */
const HTTP_MESSAGES: Record<number, string> = {
  400: 'Solicitud inválida. Revisa los datos ingresados.',
  401: 'Credenciales inválidas o sesión expirada.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'El recurso solicitado no existe.',
  409: 'El recurso ya existe o hay un conflicto.',
  422: 'Los datos ingresados no son válidos.',
  429: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.',
  500: 'Error interno del servidor. Intenta más tarde.',
  502: 'Servicio no disponible temporalmente.',
  503: 'Servicio no disponible. Intenta más tarde.',
  504: 'Tiempo de espera agotado.',
};

const GENERIC_MESSAGE = 'Ocurrió un error inesperado. Intenta de nuevo.';
const NETWORK_MESSAGE = 'No se pudo conectar con el servidor. Verifica tu conexión.';
const TIMEOUT_MESSAGE = 'La solicitud tardó demasiado. Intenta de nuevo.';

/**
 * Determina si un mensaje contiene información técnica sensible.
 */
export const containsSensitiveInfo = (message: string): boolean => {
  return SENSITIVE_PATTERNS.some(pattern => pattern.test(message));
};

interface SanitizeInput {
  status?: number;
  message?: string;
  isNetworkError?: boolean;
  isTimeout?: boolean;
}

/**
 * Convierte un error en un mensaje seguro para mostrar al usuario.
 * Nunca expone stack traces, SQL, tokens, rutas o detalles del servidor.
 */
export const sanitizeError = (input: SanitizeInput): string => {
  if (input.isTimeout) {return TIMEOUT_MESSAGE;}
  if (input.isNetworkError) {return NETWORK_MESSAGE;}

  const raw = (input.message ?? '').trim();

  // Si el backend envió información sensible, sobreescribimos con mensaje seguro.
  if (raw && containsSensitiveInfo(raw)) {
    return input.status && HTTP_MESSAGES[input.status]
      ? HTTP_MESSAGES[input.status]
      : GENERIC_MESSAGE;
  }

  // Mensaje de validación corto y limpio del backend: se muestra tal cual.
  if (raw && raw.length > 0 && raw.length <= 200) {
    return raw;
  }

  if (input.status && HTTP_MESSAGES[input.status]) {
    return HTTP_MESSAGES[input.status];
  }

  return GENERIC_MESSAGE;
};

/**
 * Logger seguro: registra en consola pero enmascara campos sensibles.
 * En producción debería enviarse a un servicio de telemetría, nunca en claro.
 */
export const safeLog = (context: string, payload: unknown): void => {
  if (typeof __DEV__ !== 'undefined' && !__DEV__) {return;}
  try {
    const masked = maskSensitiveKeys(payload);
    // eslint-disable-next-line no-console
    console.warn(`[security:${context}]`, masked);
  } catch {
    // silencioso: nunca romper por logs
  }
};

const SENSITIVE_KEYS = new Set([
  'password',
  'contraseña',
  'accesstoken',
  'access_token',
  'refreshtoken',
  'refresh_token',
  'token',
  'authorization',
  'secret',
  'apikey',
  'api_key',
]);

const maskSensitiveKeys = (value: unknown): unknown => {
  if (value === null || typeof value !== 'object') {return value;}
  if (Array.isArray(value)) {return value.map(maskSensitiveKeys);}
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase())) {
      out[k] = '***';
    } else {
      out[k] = maskSensitiveKeys(v);
    }
  }
  return out;
};
