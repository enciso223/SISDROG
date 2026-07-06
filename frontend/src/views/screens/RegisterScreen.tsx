/**
 * Vista: Registro de usuario — minimalista.
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useAuthController} from '../../controllers';
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
  const [focusedField, setFocusedField] = useState<'name' | 'email' | 'password' | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    if (!password || password.length < 6) {
      setPasswordError('Mínimo 6 caracteres');
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
      setTimeout(() => onRegisterSuccess(), 1200);
    } catch {
      // El error queda en el controlador
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, email, password]);

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
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
          {!!emailError && <Text style={styles.fieldError}>{emailError}</Text>}
        </View>

        {/* Contraseña */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'password' && styles.inputFocused,
              !!passwordError && styles.inputError,
            ]}
            value={password}
            onChangeText={t => {setPassword(t); if (passwordError) {setPasswordError(null);}}}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            autoCapitalize="none"
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />
          {!!passwordError && <Text style={styles.fieldError}>{passwordError}</Text>}
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
