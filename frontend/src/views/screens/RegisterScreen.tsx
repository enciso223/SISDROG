/**
 * Vista: Registro de usuario — minimalista.
 *
 * Seguridad:
 *  - Política de contraseñas: mínimo 8, mayúscula, minúscula, número y símbolo.
 *  - Medidor visual de fortaleza y sugerencias en vivo.
 *  - Toggle mostrar/ocultar contraseña.
 *  - La contraseña se borra del estado al desmontar o tras registro exitoso.
 *  - Errores del backend ya vienen sanitizados.
 */

import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useAuthController} from '../../controllers';
import {validatePassword, calculateStrength} from '../../security';
import {registerStyles as styles} from './RegisterScreen.styles';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
}) => {
  const {register, loading, error, clearError} = useAuthController();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<'name' | 'email' | 'password' | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Limpieza defensiva de la contraseña al desmontar
  useEffect(() => {
    return () => setPassword('');
  }, []);

  // Fortaleza reactiva
  const strength = useMemo(() => calculateStrength(password), [password]);

  // Estado de reglas para la lista de política
  const policyChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const validate = (): boolean => {
    let valid = true;
    if (!name.trim() || name.trim().length < 2) {
      setNameError('Ingresa tu nombre (mín. 2 caracteres)');
      valid = false;
    } else {
      setNameError(null);
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Ingresa un correo válido');
      valid = false;
    } else {
      setEmailError(null);
    }
    const pwd = validatePassword(password);
    if (!pwd.valid) {
      setPasswordError(pwd.errors[0]);
      valid = false;
    } else {
      setPasswordError(null);
    }
    return valid;
  };

  const handleRegister = useCallback(async () => {
    clearError();
    if (!validate()) {return;}
    try {
      await register({email: email.trim(), password, fullName: name.trim()});
      setSuccess(true);
      setPassword(''); // borrar de memoria tras éxito
      setTimeout(() => onRegisterSuccess(), 1200);
    } catch {
      // El error queda sanitizado en el controlador.
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, email, password]);

  // ── Barras del medidor (5 segmentos) ─────────────────────────────
  const segments = [0, 1, 2, 3, 4];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Logo */}
        <View style={styles.logo}>
          <Text style={styles.logoText}>F</Text>
        </View>

        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Completa los datos para registrarte</Text>

        {/* Banners */}
        {success && (
          <View style={styles.successBox}>
            <Text style={styles.successBoxText}>Cuenta creada. Redirigiendo…</Text>
          </View>
        )}
        {!!error && !success && (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{error}</Text>
          </View>
        )}

        {/* Nombre */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'name' && styles.inputFocused,
              !!nameError && styles.inputError,
            ]}
            value={name}
            onChangeText={t => {setName(t); if (nameError) {setNameError(null);}}}
            placeholder="Juan Pérez"
            placeholderTextColor="#94A3B8"
            autoCapitalize="words"
            autoCorrect={false}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
          />
          {!!nameError && <Text style={styles.fieldError}>{nameError}</Text>}
        </View>

        {/* Correo */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'email' && styles.inputFocused,
              !!emailError && styles.inputError,
            ]}
            value={email}
            onChangeText={t => {setEmail(t); if (emailError) {setEmailError(null);} if (error) {clearError();}}}
            placeholder="usuario@farmacia.com"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
          {!!emailError && <Text style={styles.fieldError}>{emailError}</Text>}
        </View>

        {/* Contraseña con toggle + medidor */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                focusedField === 'password' && styles.inputFocused,
                !!passwordError && styles.inputError,
              ]}
              value={password}
              onChangeText={t => {setPassword(t); if (passwordError) {setPasswordError(null);}}}
              placeholder="Mínimo 8 caracteres"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowPassword(v => !v)}
              activeOpacity={0.7}
              accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              <Text style={styles.passwordToggleText}>
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>
          {!!passwordError && <Text style={styles.fieldError}>{passwordError}</Text>}

          {/* Medidor de fortaleza */}
          {password.length > 0 && (
            <View style={styles.strengthWrapper}>
              <View style={styles.strengthBarTrack}>
                {segments.map(i => (
                  <View
                    key={i}
                    style={[
                      styles.strengthBarFill,
                      {
                        flex: 1,
                        marginRight: i < 4 ? 2 : 0,
                        backgroundColor:
                          i <= strength.score ? strength.color : '#E2E8F0',
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.strengthLabel, {color: strength.color}]}>
                Fortaleza: {strength.label}
              </Text>
              {strength.suggestions.length > 0 && (
                <Text style={styles.strengthHint}>
                  {strength.suggestions[0]}
                </Text>
              )}
            </View>
          )}

          {/* Checklist de política */}
          <View style={styles.policyList}>
            <Text style={[styles.policyItem, policyChecks.length && styles.policyItemOk]}>
              {policyChecks.length ? '✓' : '•'} Al menos 8 caracteres
            </Text>
            <Text style={[styles.policyItem, policyChecks.upper && policyChecks.lower && styles.policyItemOk]}>
              {policyChecks.upper && policyChecks.lower ? '✓' : '•'} Mayúscula y minúscula
            </Text>
            <Text style={[styles.policyItem, policyChecks.number && styles.policyItemOk]}>
              {policyChecks.number ? '✓' : '•'} Al menos un número
            </Text>
            <Text style={[styles.policyItem, policyChecks.symbol && styles.policyItemOk]}>
              {policyChecks.symbol ? '✓' : '•'} Al menos un símbolo (!@#$…)
            </Text>
          </View>
        </View>

        {/* Botón */}
        <TouchableOpacity
          style={[styles.button, (loading || success) && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading || success}
          activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Registrarse</Text>
          )}
        </TouchableOpacity>

        {/* Enlace a login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes cuenta?</Text>
          <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
            <Text style={styles.footerLink}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
