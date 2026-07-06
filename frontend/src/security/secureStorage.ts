/**
 * Almacenamiento seguro en memoria.
 *
 * IMPORTANTE:
 *  - NUNCA guarda contraseñas en texto claro.
 *  - Los tokens viven sólo en memoria: se pierden al cerrar la app. Esto evita
 *    exfiltración desde disco/localStorage y limita la ventana de exposición.
 *  - Si más adelante se requiere persistencia, deberá usarse el Windows
 *    Credential Manager (DPAPI) o Keychain — nunca AsyncStorage/localStorage.
 */

type Listener = () => void;

interface Session {
  token: string;
  tokenType: string;
  issuedAt: number;
}

let session: Session | null = null;
const listeners = new Set<Listener>();

const notify = (): void => {
  for (const l of listeners) {
    try {l();} catch {/* ignorar */}
  }
};

/** Guarda el token de sesión en memoria (nunca en disco). */
export const setSessionToken = (token: string, tokenType: string = 'Bearer'): void => {
  session = {token, tokenType, issuedAt: Date.now()};
  notify();
};

/** Devuelve el token de sesión actual o null. */
export const getSessionToken = (): Session | null => session;

/** Devuelve el encabezado Authorization o null. */
export const getAuthHeader = (): string | null => {
  if (!session) {return null;}
  return `${session.tokenType} ${session.token}`;
};

/** Limpia el token de sesión (logout). */
export const clearSession = (): void => {
  session = null;
  notify();
};

/** Se suscribe a cambios de la sesión. Devuelve función de baja. */
export const subscribeSession = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/**
 * Utilidad: limpia una contraseña de la memoria del componente que la usó.
 * En JS los strings son inmutables, no podemos "borrar" su contenido, pero sí
 * eliminar la referencia. Esta función existe como recordatorio semántico.
 */
export const wipePassword = (setter: (v: string) => void): void => {
  setter('');
};
