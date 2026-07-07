module.exports = {
  preset: 'react-native',
  // pnpm guarda las dependencias reales en node_modules/.pnpm y crea symlinks.
  // Esta expresión transforma tanto los symlinks planos como los paths reales de .pnpm.
  transformIgnorePatterns: [
    'node_modules/(?!((\\.pnpm/(react-native|@react-native|react-native-windows|@react-native-community|react-native-[^/]+).*?/node_modules/)?(react-native|@react-native|react-native-windows|@react-native-community|react-native-[^/]+)/))',
  ],
};
