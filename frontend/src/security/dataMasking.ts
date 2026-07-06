/**
 * Helpers de enmascaramiento de datos sensibles para la UI.
 *
 * La regla: mostrar sólo lo mínimo necesario para que el usuario reconozca el
 * dato (últimos 4 dígitos, primera letra del correo, etc.).
 */

/** usuario@dominio.com → u****@dominio.com */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) {return '***';}
  const [user, domain] = email.split('@');
  if (user.length <= 1) {return `*@${domain}`;}
  return `${user[0]}${'*'.repeat(Math.min(user.length - 1, 4))}@${domain}`;
};

/** 1234567890 → ******7890 */
export const maskId = (value: string | number, visible = 4): string => {
  const s = String(value);
  if (s.length <= visible) {return '*'.repeat(s.length);}
  return `${'*'.repeat(s.length - visible)}${s.slice(-visible)}`;
};

/** Muestra un token como Bearer *** para logs seguros. */
export const maskToken = (token: string | null | undefined): string => {
  if (!token) {return '(sin token)';}
  if (token.length <= 6) {return '***';}
  return `${token.slice(0, 3)}…${token.slice(-3)}`;
};

/** Enmascara todos los dígitos de una cadena excepto los últimos N. */
export const maskDigits = (value: string, visible = 4): string => {
  if (!value) {return '';}
  const digits = value.replace(/\D/g, '');
  if (digits.length <= visible) {return value;}
  const hidden = digits.length - visible;
  return `${'*'.repeat(hidden)}${digits.slice(-visible)}`;
};
