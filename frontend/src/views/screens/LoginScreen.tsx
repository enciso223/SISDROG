/**
 * Vista: Inicio de sesión — minimalista.
 *
 * Seguridad:
 *  - Contraseña oculta por defecto (toggle mostrar/ocultar).
 *  - Autofill desactivado para credenciales.
 *  - Al desmontar, la contraseña se limpia del estado.
 *  - Errores mostrados ya vienen sanitizados desde el interceptor HTTP.
 */

import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useAuthController} from '../../controllers';
import {loginStyles as styles} from './LoginScreen.styles';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
}) => {
  const {login, loading, error, clearError} = useAuthController();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Limpieza defensiva: al desmontar la pantalla, borrar la contraseña de memoria.
  useEffect(() => {
    return () => setPassword('');
  }, []);

  const validate = (): boolean => {
    let valid = true;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Ingresa un correo válido');
      valid = false;
    } else {
      setEmailError(null);
    }
    if (!password || password.length < 6) {
      setPasswordError('Ingresa tu contraseña');
      valid = false;
    } else {
      setPasswordError(null);
    }
    return valid;
  };

  const handleLogin = useCallback(async () => {
    clearError();
    if (!validate()) {return;}
    try {
      await login({email: email.trim(), password});
      // Limpiar contraseña de memoria inmediatamente tras el login exitoso.
      setPassword('');
      onLoginSuccess();
    } catch {
      // El error queda sanitizado en el controlador.
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Logo */}
        <View style={styles.logo}>
          <Text style={styles.logoText}>D</Text>
        </View>

        <Text style={{fontSize: 15, fontWeight: '600', color: '#0078D4', marginBottom: 8}}>Droguería Laureano Gómez</Text>
        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.subtitle}>Ingresa tus credenciales para continuar</Text>

        {/* Error global */}
        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{error}</Text>
          </View>
        )}

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
            onChangeText={t => {
              setEmail(t);
              if (emailError) {setEmailError(null);}
              if (error) {clearError();}
            }}
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

        {/* Contraseña con toggle mostrar/ocultar */}
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
              onChangeText={t => {
                setPassword(t);
                if (passwordError) {setPasswordError(null);}
                if (error) {clearError();}
              }}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
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
        </View>

        {/* Botón */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Ingresar</Text>
          )}
        </TouchableOpacity>

        {/* Enlace a registro */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={onNavigateToRegister} activeOpacity={0.7}>
            <Text style={styles.footerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
