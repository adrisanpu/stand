// Updated style constants: metallic grey background and logo-inspired pastel palette
export const COLORS = {
  // Metallic grey background
  background: '#4F4F4F',

  // Pastel palette from the Zoco logo
  primary: '#FFB3C1',    // Pastel pink (Z)
  secondary: '#B5EAD7',  // Pastel green (C)
  accent: '#CC99FF',     // Pastel purple (final o)
  highlight: '#FFF59D',  // Pastel yellow (first o)
  info: '#AEEEEE',       // Light pastel blue (logo circle)

  white: '#FFFFFF',
  black: '#000000',

  // On a dark metallic background, text stays white
  text: '#FFFFFF',

  // Standard error & success (can override if you want brand‐specific shades)
  error: '#FF3B30',
  success: '#34C759',
};

export const FONTS = {
  bold: 'System',
  regular: 'System',
  medium: 'System',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  padding: 24,
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  dark: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
};
