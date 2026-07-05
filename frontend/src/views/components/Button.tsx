/**
 * Componente visual reutilizable: Botón.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  disabled,
  ...rest
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      activeOpacity={0.8}
      disabled={disabled}
      {...rest}>
      <Text style={[styles.text, disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    backgroundColor: '#0078D4',
  },
  primary: {
    backgroundColor: '#0078D4',
  },
  secondary: {
    backgroundColor: '#6C757D',
  },
  danger: {
    backgroundColor: '#DC3545',
  },
  disabled: {
    backgroundColor: '#CCCCCC',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#666666',
  },
});
