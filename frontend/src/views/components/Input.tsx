/**
 * Componente visual reutilizable: Campo de texto.
 */

import React from 'react';
import {View, TextInput, Text, StyleSheet, TextInputProps} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
}

export const Input: React.FC<InputProps> = ({label, error, ...rest}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor="#888888"
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#DC3545',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#DC3545',
  },
});
