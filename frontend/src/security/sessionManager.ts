/**
 * Gestor de sesiones activas.
 *
 * Objetivo: cerrar la sesión automáticamente tras un periodo de inactividad
 * para reducir el riesgo si un usuario deja la máquina desatendida.
 *
 *   - IDLE_TIMEOUT_MS:   tiempo total antes de cerrar sesión.
 *   - WARNING_BEFORE_MS: cuánto antes se muestra la advertencia al usuario.
 */

// Contexto: vendedor único de droguería con jornadas largas.
// 2 h de inactividad antes de cerrar sesión, con 2 min de aviso previo.
export const IDLE_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 h
export const WARNING_BEFORE_MS = 2 * 60 * 1000;    // 2 min de aviso

export type SessionEvent = 'warn' | 'expire' | 'reset';
export type SessionListener = (event: SessionEvent, remainingMs: number) => void;

interface Timers {
  warn: ReturnType<typeof setTimeout> | null;
  expire: ReturnType<typeof setTimeout> | null;
}

class SessionManager {
  private lastActivity: number = Date.now();
  private timers: Timers = {warn: null, expire: null};
  private listeners = new Set<SessionListener>();
  private running = false;

  /** Arranca el conteo de inactividad. */
  start(): void {
    this.running = true;
    this.resetTimers();
  }

  /** Detiene los timers (útil al hacer logout manual). */
  stop(): void {
    this.running = false;
    if (this.timers.warn) {clearTimeout(this.timers.warn);}
    if (this.timers.expire) {clearTimeout(this.timers.expire);}
    this.timers = {warn: null, expire: null};
  }

  /** Llamar en cada evento de actividad (click, tecla, mousemove). */
  registerActivity(): void {
    if (!this.running) {return;}
    this.lastActivity = Date.now();
    this.resetTimers();
    this.emit('reset', IDLE_TIMEOUT_MS);
  }

  /** Milisegundos restantes antes de la expiración. */
  remainingMs(): number {
    return Math.max(0, IDLE_TIMEOUT_MS - (Date.now() - this.lastActivity));
  }

  subscribe(listener: SessionListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: SessionEvent, remaining: number): void {
    for (const l of this.listeners) {
      try {l(event, remaining);} catch {/* ignorar */}
    }
  }

  private resetTimers(): void {
    if (this.timers.warn) {clearTimeout(this.timers.warn);}
    if (this.timers.expire) {clearTimeout(this.timers.expire);}

    this.timers.warn = setTimeout(() => {
      this.emit('warn', WARNING_BEFORE_MS);
    }, IDLE_TIMEOUT_MS - WARNING_BEFORE_MS);

    this.timers.expire = setTimeout(() => {
      this.emit('expire', 0);
      this.stop();
    }, IDLE_TIMEOUT_MS);
  }
}

export const sessionManager = new SessionManager();
