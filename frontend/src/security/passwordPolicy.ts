/**
 * Política de contraseñas (frontend).
 *
 * Nota: la seguridad real (hashing, salt) es responsabilidad del backend.
 * Este módulo sólo aplica reglas de calidad para evitar contraseñas triviales
 * antes de enviarlas por la red y ofrece un medidor de fortaleza para la UI.
 */

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4; // 0 = muy débil, 4 = muy fuerte
  label: 'Muy débil' | 'Débil' | 'Aceptable' | 'Fuerte' | 'Muy fuerte';
  color: string;
  suggestions: string[];
}

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: PasswordStrength;
}

const COMMON_PASSWORDS = new Set([
  '123456',
  '123456789',
  'password',
  'contraseña',
  'qwerty',
  'admin',
  'admin123',
  'sisdrog',
  'farmacia',
  'droguería',
  '111111',
  'abcdef',
  'welcome',
]);

const MIN_LENGTH = 8;

/**
 * Reglas mínimas obligatorias para aceptar una contraseña.
 */
export const passwordRules = {
  minLength: MIN_LENGTH,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSymbol: true,
};

const rulePatterns = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /\d/,
  symbol: /[^A-Za-z0-9]/,
};

/**
 * Calcula la fortaleza (0-4) de una contraseña con criterios simples.
 */
export const calculateStrength = (password: string): PasswordStrength => {
  const suggestions: string[] = [];
  if (!password) {
    return {
      score: 0,
      label: 'Muy débil',
      color: '#DC2626',
      suggestions: ['Ingresa una contraseña'],
    };
  }

  let score = 0;

  if (password.length >= MIN_LENGTH) {score++;} else {
    suggestions.push(`Usa al menos ${MIN_LENGTH} caracteres`);
  }
  if (password.length >= 12) {score++;}
  if (rulePatterns.uppercase.test(password) && rulePatterns.lowercase.test(password)) {
    score++;
  } else {
    suggestions.push('Combina mayúsculas y minúsculas');
  }
  if (rulePatterns.number.test(password)) {score++;} else {
    suggestions.push('Añade al menos un número');
  }
  if (rulePatterns.symbol.test(password)) {score++;} else {
    suggestions.push('Añade un símbolo (!@#$…)');
  }

  // Penaliza contraseñas comunes
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    score = 0;
    suggestions.unshift('Esta contraseña es demasiado común');
  }

  // Normaliza a 0-4
  const finalScore = Math.max(0, Math.min(4, score - 1)) as PasswordStrength['score'];

  const labels: PasswordStrength['label'][] = [
    'Muy débil',
    'Débil',
    'Aceptable',
    'Fuerte',
    'Muy fuerte',
  ];
  const colors = ['#DC2626', '#F59E0B', '#EAB308', '#10B981', '#059669'];

  return {
    score: finalScore,
    label: labels[finalScore],
    color: colors[finalScore],
    suggestions,
  };
};

/**
 * Valida que una contraseña cumpla las reglas mínimas.
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  if (!password || password.length < passwordRules.minLength) {
    errors.push(`Debe tener al menos ${passwordRules.minLength} caracteres`);
  }
  if (passwordRules.requireUppercase && !rulePatterns.uppercase.test(password)) {
    errors.push('Debe incluir una mayúscula');
  }
  if (passwordRules.requireLowercase && !rulePatterns.lowercase.test(password)) {
    errors.push('Debe incluir una minúscula');
  }
  if (passwordRules.requireNumber && !rulePatterns.number.test(password)) {
    errors.push('Debe incluir un número');
  }
  if (passwordRules.requireSymbol && !rulePatterns.symbol.test(password)) {
    errors.push('Debe incluir un símbolo');
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    errors.push('La contraseña es demasiado común');
  }

  return {
    valid: errors.length === 0,
    errors,
    strength: calculateStrength(password),
  };
};
